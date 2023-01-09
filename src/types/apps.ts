import { UserProfile } from './mattermost';

export type AppManifest = {
    app_id: string;
    display_name: string;
    description?: string;
    homepage_url?: string;
    root_url?: string;
}

export type AppAppContext = {
    SchemaVersion: string,
    app_id: string,
    version: string,
    homepage_url: string,
    deploy_type: string,
    webhook_secret: string,
    bot_user_id: string,
    bot_username: string,
    remote_oauth2: any
};

export type AppActingUser = {
    id: string,
    delete_at: number,
    username: string,
    auth_service: string,
    email: string,
    nickname: string,
    first_name: string,
    last_name: string,
    position: string,
    roles: string,
    locale: string,
    timezone: any,
    disable_welcome_email: boolean
}

export type AppFieldType = string;

export type AppSelectOption = {
    label: string;
    value: string;
    icon_data?: string;
};

export type Oauth2CurrentUser = {
    token: string;
}

export interface Oauth2Data {
    workspace: string;
}

export type Oauth2App = {
    client_id: string;
    client_secret: string;
    connect_url?: string;
    complete_url?: string;
    user?: Oauth2CurrentUser;
    data?: Oauth2Data;
}

export type ContextChannel = {
    id: string;
    team_id: string;
}

export type AppFormValue = string | AppSelectOption | boolean | null;

export type AppFormValues = { [name: string]: AppFormValue };

// This should go in mattermost-redux
export type AppField = {

    // Name is the name of the JSON field to use.
    name: string;
    type: AppFieldType;
    is_required?: boolean;
    readonly?: boolean;

    // Present (default) value of the field
    value?: AppFormValue;
    description?: string;
    label?: string;
    hint?: string;
    position?: number;
    modal_label?: string;

    // Select props
    refresh?: boolean;
    options?: AppSelectOption[];
    multiselect?: boolean;

    // Text props
    subtype?: string;
    min_length?: number;
    max_length?: number;
};

export type AppCallValues = {
    [name: string]: any;
};

export type AppCallType = string;

export type AppContextProps = {
    [name: string]: string;
};

export type AppExpandLevel = string;

export type AppExpand = {
    app?: AppExpandLevel;
    acting_user?: AppExpandLevel;
    channel?: AppExpandLevel;
    config?: AppExpandLevel;
    mentioned?: AppExpandLevel;
    parent_post?: AppExpandLevel;
    post?: AppExpandLevel;
    root_post?: AppExpandLevel;
    team?: AppExpandLevel;
    user?: AppExpandLevel;
};

export type AppCall = {
    path: string;
    expand?: AppExpand;
    state?: any;
};

export type AppForm = {
    title?: string;
    header?: string;
    footer?: string;
    icon?: string;
    submit_buttons?: string;
    cancel_button?: boolean;
    submit_on_cancel?: boolean;
    fields?: AppField[];
    call?: AppCall;
    depends_on?: string[];
    form?: any;
    source?: any;
    submit?: any;
    submit_label?: string;
};

export type AppContext = {
    app_id: string;
    location?: string;
    locale?: string;
    acting_user_id?: string;
    bot_user_id?: string;
    user_id?: string;
    channel: ContextChannel;
    team_id?: string;
    post_id?: string;
    root_id?: string;
    props?: AppContextProps;
    user_agent?: string;
    bot_access_token?: string;
    mattermost_site_url?: string;
    app?: AppAppContext;
    acting_user?: AppActingUser;
    acting_user_access_token?: string;
    oauth2?: Oauth2App;
};

export type AppCallRequest = AppCall & {
    context: AppContext;
    values?: AppCallValues;
    raw_command?: string;
    selected_field?: string;
    query?: string;
};

export type AppModalState = {
    form: AppForm;
    call: AppCallRequest;
}

export type AppBinding = {
    location?: string;
    icon?: string;

    // Label is the (usually short) primary text to display at the location.
    // - For LocationPostMenu is the menu item text.
    // - For LocationChannelHeader is the dropdown text.
    // - For LocationCommand is the name of the command
    label: string;

    // Hint is the secondary text to display
    // - LocationPostMenu: not used
    // - LocationChannelHeader: tooltip
    // - LocationCommand: the "Hint" line
    hint?: string;

    // Description is the (optional) extended help.ts text, used in modals and autocomplete
    description?: string;

    // A Binding is either to a Call, or is a "container" for other locations -
    // i.e. menu sub-items or subcommands.
    call?: AppCall;
    bindings?: AppBinding[];
    form?: AppForm;
};

export type AppsState = {
    location: string;
    bindings: AppBinding[];
};

export type ExpandedOauth2App = AppContext & {
    oauth2: Oauth2App,
}

export type ExpandedBotActingUser = AppContext & {
    acting_user: UserProfile,
    acting_user_access_token: string
    bot_user_id: string,
    bot_access_token: string,
}

export type AppCallResponseType = string;

export type AppCallResponse<Res = unknown> = {
    type: AppCallResponseType;
    text?: string;
    data?: Res;
    error?: string;
    navigate_to_url?: string;
    use_external_browser?: boolean;
    call?: AppCall;
    form?: AppForm;
    props?: any;
};

export type AutocompleteSuggestion = {
    suggestion: string;
    complete?: string;
    description?: string;
    hint?: string;
    iconData?: string;
}

export type AutocompleteSuggestionWithComplete = AutocompleteSuggestion & {
    complete: string;
}

export type AutocompleteElement = AppField;
export type AutocompleteStaticSelect = AutocompleteElement & {
    options: AppSelectOption[];
};

export type AutocompleteDynamicSelect = AutocompleteElement;

export type AutocompleteUserSelect = AutocompleteElement;

export type AutocompleteChannelSelect = AutocompleteElement;

export type FormResponseData = {
    errors?: {
        [field: string]: string;
    };
}

export type AppLookupResponse = {
    items: AppSelectOption[];
}

export type AppAttachmentActionIntegration = {
    url: string;
    context: any;
}

export type AppAttachmentActionOptions = {
    text: string;
    value: string;
}

export type AppAttachmentAction = {
    id: string;
    name: string;
    integration: AppAttachmentActionIntegration;
    options?: AppAttachmentActionOptions[];
    type: string;
}

export type AppPostMessageAttachment = {
    pretext?: string;
    text?: string;
    actions?: AppAttachmentAction[];
}

export type AppPostMessageProps = {
    attachments: AppPostMessageAttachment[];
}

export type AppPostMessage = {
    channel_id: string;
    message: string;
    props: AppPostMessageProps;
}

export type ExpandedBot = AppContext & {
    bot_user_id: string,
    bot_access_token: string,
}

export type ExpandedActingUserAccessToken = AppContext & {
    acting_user_access_token: string
}

export type AppCallRequestWithValues = AppCall & {
    values: AppCallValues
    context: AppContext
}

export type CtxExpandedBotActingUserAccessToken = ExpandedActingUserAccessToken & ExpandedBot
