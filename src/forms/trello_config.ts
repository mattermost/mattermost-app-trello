import {
    AppActingUser,
    AppCallRequest,
    AppCallValues,
    AppForm,
    ExpandedBotActingUser,
    Oauth2App,
} from '../types';

import {
    AppExpandLevels,
    AppFieldTypes,
    ConfigureWorkspaceForm,
    ExceptionType,
    Routes,
    TrelloIcon,
} from '../constant';
import { KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { configureI18n } from '../utils/translations';
import { TrelloClient, TrelloOptions } from '../clients/trello';
import { isUserSystemAdmin, tryPromise } from '../utils';
import { Exception } from '../utils/exception';

export async function newConfigForm(call: AppCallRequest): Promise<AppForm> {
    const oauth2 = call.context.oauth2 as Oauth2App;
    const i18nObj = configureI18n(call.context);

    const actingUser: AppActingUser = call.context.acting_user as AppActingUser;

    if (!isUserSystemAdmin(actingUser)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.config.error.system-admin'));
    }

    const fields = [
        {
            type: AppFieldTypes.TEXT,
            name: ConfigureWorkspaceForm.TRELLO_WORKSPACE,
            label: i18nObj.__('forms.config.workspace.label'),
            value: oauth2?.data?.workspace,
            hint: i18nObj.__('forms.config.workspace.hint'),
            description: i18nObj.__('forms.config.workspace.description'),
            is_required: true,
        },
        {
            type: AppFieldTypes.TEXT,
            name: ConfigureWorkspaceForm.TRELLO_APIKEY,
            modal_label: i18nObj.__('forms.config.apikey.label'),
            value: oauth2?.client_id,
            description: i18nObj.__('forms.config.apikey.description'),
            is_required: true,
        },
        {
            type: AppFieldTypes.TEXT,
            subtype: 'password',
            name: ConfigureWorkspaceForm.TRELLO_TOKEN,
            modal_label: i18nObj.__('forms.config.token.label'),
            value: oauth2?.client_secret,
            description: i18nObj.__('forms.config.token.description'),
            is_required: true,
        },
    ];

    return {
        title: i18nObj.__('forms.config.title'),
        header: i18nObj.__('forms.config.header'),
        icon: TrelloIcon,
        fields,
        submit: {
            path: Routes.App.CallPathConfigSubmitOrUpdateForm,
            expand: {
                acting_user: AppExpandLevels.EXPAND_ALL,
                acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                oauth2_app: AppExpandLevels.EXPAND_ALL,
                oauth2_user: AppExpandLevels.EXPAND_ALL,
            },
        },
    } as AppForm;
}

export async function submitConfigForm(call: AppCallRequest): Promise<string> {
    const mattermostURL: string | undefined = call.context.mattermost_site_url;
    const accessToken: string | undefined = call.context.acting_user_access_token;
    const values: AppCallValues = call.values as AppCallValues;
    const i18nObj = configureI18n(call.context);

    const actingUser: AppActingUser = call.context.acting_user as AppActingUser;

    if (!isUserSystemAdmin(actingUser)) {
        throw new Exception(ExceptionType.TEXT_ERROR, i18nObj.__('forms.config.error.system-admin'));
    }

    const apiKey: string = values[ConfigureWorkspaceForm.TRELLO_APIKEY];
    const token: string = values[ConfigureWorkspaceForm.TRELLO_TOKEN];
    const workspace: string = values[ConfigureWorkspaceForm.TRELLO_WORKSPACE];

    const options: KVStoreOptions = {
        mattermostUrl: <string>mattermostURL,
        accessToken: <string>accessToken,
    };

    const kvStoreClient = new KVStoreClient(options);

    const trelloOptions: TrelloOptions = {
        apiKey,
        token,
    };
    const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

    await tryPromise(trelloClient.validateToken(workspace), ExceptionType.TEXT_ERROR, i18nObj.__('api.configure.config_failed'));

    const oauth2App: Oauth2App = {
        client_id: apiKey,
        client_secret: token,
        data: {
            workspace,
        },
    };

    await kvStoreClient.storeOauth2App(oauth2App);

    return i18nObj.__('api.configure.config_success');
}
