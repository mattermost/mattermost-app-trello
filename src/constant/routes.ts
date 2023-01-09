export const AppsPluginName = 'com.mattermost.apps';

const PathsVariable = {
    Identifier: ':IDENTIFIER',
};

const AppPaths = {
    ManifestPath: '/manifest.json',
    BindingsPath: '/bindings',
    InstallPath: '/install',

    BoardSelectPath: '/board_select',
    ListSelectPath: '/list_select',

    AddFormStepOnePath: '/add/stepone',
    AddFormStepTwoPath: '/add/steptwo',
    BindingPathCreateCard: '/create-card',

    Lookup: '/lookup',
    Form: '/form',
    Submit: '/submit',
    Forms: '/forms',

    BindingPathHelp: '/help',
    BindingPathAdd: '/add',
    BindingPathNew: '/new',
    BindingPathLink: '/link',
    BindingPathConfigure: '/configure',

    BindingPathConnect: '/connect',
    BindingPathDisconnect: '/disconnect',

    CallPathConfigOpenForm: '/config/open-form',
    CallPathConfigSubmitOrUpdateForm: '/config/submit-or-update',

    CallSubscriptionAdd: '/subscription/add',
    CallSubscriptionReceiveNotification: '/subscription/receive-data',
    CallSubscriptionList: '/subscription/list',
    CallSubscriptionRemove: '/subscription/remove',
    CallSubscriptionListAppOpts: '/subscription/app-options/list',
    CallMattermostSubscription: '/subscription',

    CallPathIncomingWebhookPath: '/webhook',
};

const MattermostPaths = {
    PathKV: '/kv',
    UsersUpdateRolePath: `/users/${PathsVariable.Identifier}/roles`,
    PostsPath: '/posts',
    PostPath: `/posts/${PathsVariable.Identifier}`,
    UserPath: `/users/${PathsVariable.Identifier}`,
    DialogsOpenPath: '/actions/dialogs/open',
    ApiVersionV4: '/api/v4',
    ApiVersionV1: '/api/v1',
    Hooks: '/hooks',
    HooksIncoming: '/hooks/incoming',
    PathOAuth2App: '/oauth2/app',
    PathOAuth2User: '/oauth2/user',
};

const TrelloPaths = {
    getMembers: 'members/me',
    webhooks: 'webhooks',
    tokens: 'tokens',
    organizations: 'organizations',
    authorize: 'authorize',
    boards: 'boards',
    search: 'search',
    lists: 'lists',
    cards: 'cards',

};

export const Routes = {
    PathsVariable,
    App: AppPaths,
    Mattermost: MattermostPaths,
    TP: TrelloPaths,
};
