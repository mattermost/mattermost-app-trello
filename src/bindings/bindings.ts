import { AppExpandLevels, AppFieldTypes, Commands, Routes, TrelloIcon } from '../constant';
import { AppBinding, AppContext } from '../types';
import { SubscriptionCreateForm, SubscriptionRemoveForm } from '../constant/forms';
import { configureI18n } from '../utils/translations';

export const getHelpBinding = (context: AppContext): any => {
    const i18nObj = configureI18n(context);

    return {
        icon: TrelloIcon,
        label: Commands.HELP,
        description: i18nObj.__('binding.help.description'),
        form: {
            title: i18nObj.__('binding.help.title'),
            icon: TrelloIcon,
            submit: {
                path: Routes.App.BindingPathHelp,
                expand: {
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                },
            },
        },
    };
};

export const getCardBinding = (context: AppContext) => {
    const i18nObj = configureI18n(context);

    const commands: string[] = [
        Commands.CREATE,
    ];

    return {
        icon: TrelloIcon,
        label: Commands.CARD,
        description: i18nObj.__('binding.get.description'),
        hint: `[${commands.join(' | ')}]`,
        bindings: [
            getCardCreateBinding(context),
        ],
    };
};

export const getCardCreateBinding = (context: AppContext) => {
    const i18nObj = configureI18n(context);

    return {
        icon: TrelloIcon,
        label: Commands.CREATE,
        description: i18nObj.__('binding.create.decription'),
        form: {
            title: i18nObj.__('binding.create.decription'),
            icon: TrelloIcon,
            submit: {
                path: `${Routes.App.Forms}${Routes.App.BindingPathCreateCard}`,
                expand: {
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                },
            },
            fields: [
                {
                    type: AppFieldTypes.TEXT,
                    name: 'card_name',
                    modal_label: i18nObj.__('binding.create.card_name'),
                    description: i18nObj.__('binding.create.card_description'),
                },
                {
                    type: AppFieldTypes.TEXT,
                    name: 'board_name',
                    modal_label: i18nObj.__('binding.create.board_name'),
                    description: i18nObj.__('binding.create.board_description'),
                },
                {
                    type: AppFieldTypes.TEXT,
                    name: 'list_name',
                    modal_label: i18nObj.__('binding.create.list_name'),
                    description: i18nObj.__('binding.create.list_description'),
                },
            ],
        },
    };
};

export const getSubscriptionBinding = (context: AppContext): any => {
    const i18nObj = configureI18n(context);

    const subCommands: string[] = [
        Commands.ADD,
        Commands.LIST,
        Commands.REMOVE,
    ];

    const bindings: AppBinding[] = [
        getAddSubBinding(context),
        getListSubBinding(context),
        getRemoveSubBinding(context),
    ];

    return {
        icon: TrelloIcon,
        label: Commands.SUBSCRIPTION,
        description: i18nObj.__('binding.subscription.get'),
        hint: `[${subCommands.join(' | ')}]`,
        bindings,
    };
};

export const getAddSubBinding = (context: AppContext): any => {
    const i18nObj = configureI18n(context);

    return {
        icon: TrelloIcon,
        label: Commands.ADD,
        description: i18nObj.__('binding.add.description'),
        form: {
            title: i18nObj.__('binding.add.title'),
            icon: TrelloIcon,
            submit: {
                path: Routes.App.CallSubscriptionAdd,
                expand: {
                    app: AppExpandLevels.EXPAND_ALL,
                    channel: AppExpandLevels.EXPAND_ALL,
                    admin_access_token: AppExpandLevels.EXPAND_ALL,
                    user: AppExpandLevels.EXPAND_SUMMARY,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                },
            },
            fields: [
                {
                    modal_label: i18nObj.__('binding.add.board_name'),
                    name: SubscriptionCreateForm.BOARD_NAME,
                    type: AppFieldTypes.TEXT,
                    is_required: true,
                    position: 1,
                    max_length: 100,
                },
                {
                    modal_label: i18nObj.__('binding.add.channel'),
                    name: SubscriptionCreateForm.CHANNEL_ID,
                    type: AppFieldTypes.CHANNEL,
                    is_required: true,
                    position: 2,
                },
            ],
        },
    };
};

export const getListSubBinding = (context: AppContext): any => {
    const i18nObj = configureI18n(context);

    return {
        icon: TrelloIcon,
        label: Commands.LIST,
        description: i18nObj.__('binding.sub_list.description'),
        form: {
            submit: {
                path: Routes.App.CallSubscriptionList,
                expand: {
                    app: AppExpandLevels.EXPAND_ALL,
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                },
            },
        },
    };
};

export const getRemoveSubBinding = (context: AppContext): any => {
    const i18nObj = configureI18n(context);

    return {
        icon: TrelloIcon,
        label: Commands.REMOVE,
        description: i18nObj.__('binding.remove.description'),
        form: {
            title: i18nObj.__('binding.remove.title'),
            icon: TrelloIcon,
            submit: {
                path: Routes.App.CallSubscriptionRemove,
                expand: {
                    app: AppExpandLevels.EXPAND_ALL,
                    channel: AppExpandLevels.EXPAND_ALL,
                    admin_access_token: AppExpandLevels.EXPAND_ALL,
                    user: AppExpandLevels.EXPAND_SUMMARY,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                },
                call: {
                    path: Routes.App.CallSubscriptionListAppOpts,
                },
            },
            fields: [
                {
                    modal_label: i18nObj.__('binding.remove.subcription'),
                    name: SubscriptionRemoveForm.SUBSCRIPTION,
                    type: AppFieldTypes.TEXT,
                    is_required: true,
                    position: 1,
                    max_length: 100,
                },
            ],
        },
    };
};

export const getConfigureBinding = (context: AppContext): any => {
    const i18nObj = configureI18n(context);

    return {
        icon: TrelloIcon,
        label: Commands.CONFIGURE,
        description: i18nObj.__('binding.configure.description'),
        form: {
            title: i18nObj.__('binding.configure.title'),
            icon: TrelloIcon,
            submit: {
                path: Routes.App.CallPathConfigOpenForm,
                expand: {
                    app: AppExpandLevels.EXPAND_ALL,
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                    locale: AppExpandLevels.EXPAND_ALL,
                },
            },
        },
    };
};

export const getAccountConnectBinding = (context: AppContext): any => {
    const i18nObj = configureI18n(context);

    return {
        icon: TrelloIcon,
        label: Commands.CONNECT,
        description: i18nObj.__('binding.account.description'),
        form: {
            title: i18nObj.__('binding.account.title'),
            icon: TrelloIcon,
            submit: {
                path: `${Routes.App.BindingPathConnect}`,
                expand: {
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                },
            },
        },
    };
};

export const getAccountDisconnectBinding = (context: AppContext): any => {
    const i18nObj = configureI18n(context);

    return {
        icon: TrelloIcon,
        label: Commands.DISCONNECT,
        description: i18nObj.__('binding.disconnect.description'),
        form: {
            title: i18nObj.__('binding.disconnect.title'),
            icon: TrelloIcon,
            submit: {
                path: `${Routes.App.BindingPathDisconnect}`,
                expand: {
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                    channel: AppExpandLevels.EXPAND_ALL,
                    user: AppExpandLevels.EXPAND_ALL,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                },
            },
        },
    };
};
