import { ExceptionType } from '../constant';
import config from '../config';
import { AppActingUser, AppCallResponse, Oauth2App } from '../types';

import {
    newErrorCallResponseWithMessage,
    newOKCallResponseWithMarkdown,
} from './call-responses';
import { Exception } from './exception';

export function isUserSystemAdmin(actingUser: AppActingUser): boolean {
    return Boolean(actingUser.roles && actingUser.roles.includes('system_admin'));
}

export function existsOauth2App(oauth2App: Oauth2App): boolean {
    return Boolean(oauth2App.client_id) && Boolean(oauth2App.client_secret);
}

export function existsToken(oauth2App: Oauth2App): boolean {
    const oauthUser = oauth2App.user;
    return Boolean(oauthUser?.token);
}

export function replace(value: string, searchValue: string, replaceValue: string): string {
    return value.replace(searchValue, replaceValue);
}

export function errorDataMessage(error: Exception | Error | any): string {
    const errorMessage: string = error?.response?.data || error?.response?.data?.message || error?.message || error;
    return `${errorMessage}`;
}

export function tryPromise(p: Promise<any>, exceptionType: ExceptionType, message: string) {
    return p.catch((error) => {
        const errorMessage: string = errorDataMessage(error);
        throw new Exception(exceptionType, `${message} ${errorMessage}`);
    });
}

export function showMessageToMattermost(exception: Exception | Error): AppCallResponse {
    if (!(exception instanceof Exception)) {
        return newErrorCallResponseWithMessage(exception.message);
    }

    switch (exception.type) {
    case ExceptionType.TEXT_ERROR:
        return newErrorCallResponseWithMessage(exception.message);
    case ExceptionType.MARKDOWN:
        return newOKCallResponseWithMarkdown(exception.message);
    default:
        return newErrorCallResponseWithMessage(exception.message);
    }
}

export function getHTTPPath(): string {
    const host: string = config.APP.HOST;
    const ip: string = host.replace(/^(http:\/\/|https:\/\/|)/g, '');

    if ((/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/).test(ip)) {
        return `${config.APP.HOST}:${config.APP.PORT}`;
    }

    return config.APP.HOST;
}
