import { Request, Response } from 'express';
import queryString, { ParsedQuery } from 'query-string';

import {
    AppCallRequest,
    AppCallResponse,
    AppContext,
    PostCreate,
    TrelloAction,
    TrelloModel,
    TrelloWebhookResponse,
    WebhookRequest,
} from '../types';
import { newErrorCallResponseWithMessage, newOKCallResponse } from '../utils';
import { h5 } from '../utils/markdown';
import { MattermostClient, MattermostOptions } from '../clients/mattermost';
import { configureI18n } from '../utils/translations';
import { WebhookFunction } from '../types/functions';

async function notifyCardMoved(event: WebhookRequest<TrelloWebhookResponse>, context: AppContext) {
    const mattermostUrl: string | undefined = context.mattermost_site_url;
    const botAccessToken: string | undefined = context.bot_access_token;
    const action: TrelloAction = event.data.action;
    const cardModel: TrelloModel = event.data.model;
    const rawQuery: string = event.rawQuery;
    const i18nObj = configureI18n(context);

    const parsedQuery: ParsedQuery = queryString.parse(rawQuery);
    const channelId: string = <string>parsedQuery.channelId;

    const payload: PostCreate = {
        message: h5(i18nObj.__('api.webhook.card_moved', { card: action.data.card.name, board: action.data.board.name })),
        channel_id: channelId,
        props: {
            attachments: [
                {
                    author_icon: `${action.memberCreator.avatarUrl}/30.png`,
                    author_name: `${action.memberCreator.fullName}`,
                    title: i18nObj.__('api.webhook.board', { name: action.data.board.name }),
                    title_link: cardModel.url,
                    text: i18nObj.__('api.webhook.text_moved', { card: action.data.card.name, listBefore: action.data.listBefore.name, listAfter: action.data.listAfter.name }),
                },
            ],
        },
    };

    const mattermostOptions: MattermostOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };

    const mattermostClient: MattermostClient = new MattermostClient(mattermostOptions);
    await mattermostClient.createPost(payload);
}

async function notifyCardCreated(event: WebhookRequest<TrelloWebhookResponse>, context: AppContext) {
    const mattermostUrl: string | undefined = context.mattermost_site_url;
    const botAccessToken: string | undefined = context.bot_access_token;
    const action: TrelloAction = event.data.action;
    const cardModel: TrelloModel = event.data.model;
    const rawQuery: string = event.rawQuery;
    const i18nObj = configureI18n(context);

    const parsedQuery: ParsedQuery = queryString.parse(rawQuery);
    const channelId: string = <string>parsedQuery.channelId;

    const payload: PostCreate = {
        message: h5(i18nObj.__('api.webhook.message_created', { card: action.data.card.name, board: action.data.board.name })),
        channel_id: channelId,
        props: {
            attachments: [
                {
                    author_icon: `${action.memberCreator.avatarUrl}/30.png`,
                    author_name: `${action.memberCreator.fullName}`,
                    title: i18nObj.__('api.webhook.board', { name: action.data.board.name }),
                    title_link: cardModel.url,
                    text: i18nObj.__('api.webhook.text_created', { card: action.data.card.name, list: action.data.list.name }),
                },
            ],
        },
    };

    const mattermostOptions: MattermostOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const mattermostClient: MattermostClient = new MattermostClient(mattermostOptions);

    await mattermostClient.createPost(payload);
}

const WEBHOOKS_ACTIONS: { [key: string]: WebhookFunction } = {
    action_create_card: notifyCardCreated,
    action_move_card_from_list_to_list: notifyCardMoved,
};

export const incomingWebhook = async (request: Request, response: Response) => {
    const webhookRequest: WebhookRequest<any> = request.body.values;
    const context: AppContext = request.body.context;
    const i18nObj = configureI18n(context);

    let callResponse: AppCallResponse;

    try {
        const action: WebhookFunction = WEBHOOKS_ACTIONS[webhookRequest.data.action.display.translationKey];
        if (action) {
            await action(webhookRequest, context);
        }
        callResponse = newOKCallResponse();
        response.json(callResponse);
    } catch (error: any) {
        callResponse = newErrorCallResponseWithMessage(i18nObj.__('api.webhook.error', { error: error.message }));
        response.json(callResponse);
    }
};

export const notificationToMattermost = async (req: Request, res: Response) => {
    const pluginWebhook: ParsedQuery = queryString.parse(queryString.extract(req.url));
    const call: AppCallRequest = req.body;
    const i18nObj = configureI18n(call.context);
    let callResponse: AppCallResponse;

    try {
        const mattermostOptions: MattermostOptions = {
            accessToken: null,
            mattermostUrl: <string>pluginWebhook.mattermostUrl,
        };
        const mattermostClient: MattermostClient = new MattermostClient(mattermostOptions);

        await mattermostClient.createWebhook(<string>pluginWebhook.secret, <string>pluginWebhook.channelId, req.body);

        callResponse = newOKCallResponse();
        res.json(callResponse);
    } catch (error: any) {
        callResponse = newErrorCallResponseWithMessage(i18nObj.__('api.webhook.error', { error: error.message }));
        res.json(callResponse);
    }
};
