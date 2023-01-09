import axios, { AxiosResponse } from 'axios';
import queryString from 'query-string';

import {
    Manifest,
    PostCreate,
} from '../types';
import { AppsPluginName, Routes } from '../constant';
import { replace } from '../utils';
import manifest from '../manifest.json';

export interface MattermostOptions {
    mattermostUrl: string;
    accessToken: string | null | undefined;
}

export class MattermostClient {
    private readonly config: MattermostOptions;

    constructor(
        _config: MattermostOptions
    ) {
        this.config = _config;
    }

    public updateRolesByUser(userId: string, roles: string): Promise<any> {
        const url = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.UsersUpdateRolePath}`;

        return axios.put(replace(url, Routes.PathsVariable.Identifier, userId), { roles }, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public createPost(post: PostCreate): Promise<any> {
        const url = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.PostsPath}`;

        return axios.post(url, post, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public createWebhook(secret: string, channelId: string, eventData: any): Promise<string> {
        const m: Manifest = manifest;
        const params: string = queryString.stringify({
            secret,
            channelId,
        });
        const url = `${this.config.mattermostUrl}/plugins/${AppsPluginName}/apps/${m.app_id}${Routes.App.CallPathIncomingWebhookPath}?${params}`;
        return axios.post(`${url}`, eventData).
            then((response: AxiosResponse<any>) => response.data);
    }
}
