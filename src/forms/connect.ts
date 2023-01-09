import queryString from 'query-string';

import { AppCallRequest, AppCallValues, AppForm, Oauth2App, Oauth2CurrentUser } from '../types';
import { AppExpandLevels, AppFieldTypes, ExceptionType, Routes, TRELLO_OAUTH, TrelloIcon } from '../constant';
import { KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { existsOauth2App, existsToken, tryPromise } from '../utils';
import { TrelloClient } from '../clients/trello';
import { ConnectForm } from '../constant/forms';
import config from '../config';
import { Exception } from '../utils/exception';
import { configureI18n } from '../utils/translations';

export async function getConnectForm(call: AppCallRequest): Promise<AppForm> {
    const i18nObj = configureI18n(call.context);
    const oauth2 = call.context.oauth2 as Oauth2App;
    const oauth2User = call.context.oauth2?.user;

    if (!existsOauth2App(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_1'));
    }

    const queryParams: string = queryString.stringify({
        expiration: TRELLO_OAUTH.EXPIRATION.NEVER,
        name: TRELLO_OAUTH.APP_NAME,
        scope: `${TRELLO_OAUTH.SCOPE.READ},${TRELLO_OAUTH.SCOPE.WRITE}`,
        response_type: TRELLO_OAUTH.RESPONSE_TYPE.TOKEN,
        key: oauth2.client_id,
    });

    const url = `${config.TRELLO.URL}${Routes.TP.authorize}?${queryParams}`;
    const fields = [
        {
            type: AppFieldTypes.TEXT,
            name: ConnectForm.TOKEN,
            modal_label: i18nObj.__('forms.connect.label_token'),
            value: oauth2User?.token,
            hint: i18nObj.__('forms.connect.hint_token'),
            description: i18nObj.__('forms.connect.description_token', { url }),
            is_required: true,
        },
    ];

    return {
        title: i18nObj.__('forms.connect.title_trello'),
        header: i18nObj.__('forms.connect.header_trello'),
        icon: TrelloIcon,
        fields,
        submit: {
            path: `${Routes.App.BindingPathConnect}${Routes.App.Submit}`,
            expand: {
                acting_user: AppExpandLevels.SUMMARY,
                acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                oauth2_app: AppExpandLevels.EXPAND_ALL,
                oauth2_user: AppExpandLevels.EXPAND_ALL,
            },
        },
    } as AppForm;
}

export async function connectFormSaveToken(call: AppCallRequest): Promise<string> {
    const accessToken: string | undefined = call.context.acting_user_access_token;
    const mattermost_url: string | undefined = call.context.mattermost_site_url;
    const values: AppCallValues | undefined = call.values;
    const oauth2 = call.context.oauth2 as Oauth2App;
    const i18nObj = configureI18n(call.context);

    const token: string = values?.[ConnectForm.TOKEN];

    const trelloOptions = {
        apiKey: oauth2.client_id,
        token,
        workspace: <string>oauth2.data?.workspace,
    };
    const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
    await tryPromise(trelloClient.validateToken(trelloOptions.workspace), ExceptionType.TEXT_ERROR, i18nObj.__('error.trello'));

    const oauth2User: Oauth2CurrentUser = {
        token,
    };

    const kvOptions: KVStoreOptions = {
        accessToken: <string>accessToken,
        mattermostUrl: <string>mattermost_url,
    };

    const kvClient = new KVStoreClient(kvOptions);
    await kvClient.storeOauth2User(oauth2User);

    return i18nObj.__('api.connect.save');
}

export async function disconnectToken(call: AppCallRequest): Promise<string> {
    const i18nObj = configureI18n(call.context);
    const accessToken: string | undefined = call.context.acting_user_access_token;
    const mattermostURL: string | undefined = call.context.mattermost_site_url;
    const oauth2 = call.context.oauth2 as Oauth2App;

    if (!existsToken(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('api.connect.disconnect_exception'));
    }

    const kvOptions: KVStoreOptions = {
        accessToken: <string>accessToken,
        mattermostUrl: <string>mattermostURL,
    };
    const kvClient: KVStoreClient = new KVStoreClient(kvOptions);
    await kvClient.storeOauth2User({});

    return i18nObj.__('api.connect.disconnect_success');
}
