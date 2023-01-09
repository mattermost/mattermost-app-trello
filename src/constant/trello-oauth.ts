const EXPIRATION = {
    HOUR: '1hour',
    DAY: '1day',
    MONTH: '30days',
    NEVER: 'never',
};

const SCOPE = {
    WRITE: 'write',
    READ: 'read',
    ACCOUNT: 'account',
};

const RESPONSE_TYPE = {
    TOKEN: 'token',
    FRAGMENT: 'fragment',
};

export const TRELLO_OAUTH = {
    EXPIRATION,
    SCOPE,
    RESPONSE_TYPE,
    APP_NAME: 'Mattermost Trello',
    BASE_URL: 'https://trello.com/1/authorize',
};