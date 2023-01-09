import axios, { AxiosResponse } from 'axios';

import { AppsPluginName, Routes } from '../constant';
import { Oauth2App, Oauth2CurrentUser } from '../types';

export interface KVStoreOptions {
    mattermostUrl: string;
    accessToken: string;
}

export interface ConfigStoreProps {
    trello_apikey: string;
    trello_oauth_access_token: string;
    trello_workspace: string;
}

export interface StoredOauthUserToken {
    oauth_token: string;
}

export class KVStoreClient {
    private readonly config: KVStoreOptions;

    constructor(
        _config: KVStoreOptions
    ) {
        this.config = _config;
    }

    public storeOauth2App(data: Oauth2App): Promise<any> {
        const url = `${this.config.mattermostUrl}/plugins/${AppsPluginName}${Routes.Mattermost.ApiVersionV1}${Routes.Mattermost.PathOAuth2App}`;
        return axios.post(url, data, {
            headers: {
                Authorization: `BEARER ${this.config.accessToken}`,
                'content-type': 'application/json; charset=UTF-8',
            },
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public storeOauth2User(currentUser: Oauth2CurrentUser | object): Promise<any> {
        const url = `${this.config.mattermostUrl}/plugins/${AppsPluginName}${Routes.Mattermost.ApiVersionV1}${Routes.Mattermost.PathOAuth2User}`;
        return axios.post(url, currentUser, {
            headers: {
                Authorization: `BEARER ${this.config.accessToken}`,
                'content-type': 'application/json; charset=UTF-8',
            },
        }).then((response: AxiosResponse<any>) => response.data);
    }
}
