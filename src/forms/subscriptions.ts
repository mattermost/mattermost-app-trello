import queryString from 'query-string';
import { head } from 'lodash';

import { TrelloClient, TrelloOptions } from '../clients/trello';
import {
    ExceptionType,
    Routes,
    SubscriptionCreateForm,
    SubscriptionRemoveForm,
} from '../constant';

import {
    AppCallRequest,
    AppCallValues,
    Board,
    Oauth2App,
    SearchResponse,
    TrelloOrganization,
    TrelloWebhook,
    WebhookCreate,
} from '../types';
import { existsToken, getHTTPPath, tryPromise } from '../utils';
import { Exception } from '../utils/exception';
import { configureI18n } from '../utils/translations';
import { h6, joinLines } from '../utils/markdown';

export async function addSubscriptionCall(call: AppCallRequest): Promise<void> {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const whSecret: string | undefined = call.context.app?.webhook_secret;
    const values: AppCallValues | undefined = call.values;
    const i18nObj = configureI18n(call.context);
    const oauth2 = call.context.oauth2 as Oauth2App;
    const oauth2_token = oauth2.user?.token as string;

    const boardName: string = values?.[SubscriptionCreateForm.BOARD_NAME];
    const channelId: string = values?.[SubscriptionCreateForm.CHANNEL_ID].value;
    const channelName: string = values?.[SubscriptionCreateForm.CHANNEL_ID].label;

    if (!existsToken(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_2'));
    }

    const trelloOAuthOptions: TrelloOptions = {
        apiKey: oauth2.client_id,
        token: oauth2_token,
    };

    const trelloOauthClient: TrelloClient = new TrelloClient(trelloOAuthOptions);
    const organization: TrelloOrganization = await tryPromise(trelloOauthClient.getOrganizationId(<string>oauth2.data?.workspace), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));
    const idOrganization = organization?.id;

    const searchResponse: SearchResponse = await tryPromise(trelloOauthClient.searchBoardByName(boardName, idOrganization), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));
    const board: Board | undefined = head(searchResponse.boards);

    if (!board) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.subcription.board_not_found', { name: boardName }));
    }

    const idModel: string = board.id;
    const params: string = queryString.stringify({
        secret: whSecret,
        idModel,
        channelId,
        mattermostUrl,
    });
    const url = `${getHTTPPath()}${Routes.App.CallSubscriptionReceiveNotification}?${params}`;

    const payload: WebhookCreate = {
        description: i18nObj.__('forms.subcription.description', { channel: channelName, board: board?.name }),
        idModel: board.id,
        callbackURL: url,
    };
    await tryPromise(trelloOauthClient.createTrelloWebhook(payload), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));
}

export async function removeWebhookCall(call: AppCallRequest): Promise<void> {
    const values: AppCallValues | undefined = call.values;
    const subscriptionID: string = values?.[SubscriptionRemoveForm.SUBSCRIPTION];
    const i18nObj = configureI18n(call.context);
    const oauth2 = call.context.oauth2 as Oauth2App;
    const oauth2_token = oauth2.user?.token as string;

    if (!existsToken(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_2'));
    }

    const trelloOptions: TrelloOptions = {
        apiKey: oauth2.client_id,
        token: oauth2_token,
    };

    const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
    const subscription: TrelloWebhook = await tryPromise(trelloClient.getTrelloWebhookByID(subscriptionID), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));
    const subParams = new URL(<string>subscription.callbackURL)?.searchParams;

    await tryPromise(trelloClient.getBoardById(<string>subParams.get('idModel')), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));
    await tryPromise(trelloClient.deleteTrelloWebhook(subscriptionID), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));
}

export async function listWebhookCall(call: AppCallRequest): Promise<string> {
    const i18nObj = configureI18n(call.context);
    const oauth2 = call.context.oauth2 as Oauth2App;

    if (!existsToken(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_2'));
    }

    const trelloOptions: TrelloOptions = {
        apiKey: oauth2.client_id,
        token: oauth2.user?.token as string,
    };
    const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
    const webhooks: TrelloWebhook[] = await tryPromise(trelloClient.getTrelloActiveWebhooks(), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));

    const subscriptionsText: string = [
        h6(i18nObj.__('api.subscription.response_get', { count: webhooks.length.toString() })),
        `${joinLines(
            webhooks.map((integration: TrelloWebhook) => {
                return i18nObj.__('api.subscription.response_subcription', { id: integration.id, description: integration.description });
            }).join('\n')
        )}`,
    ].join('');

    return subscriptionsText;
}