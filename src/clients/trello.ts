import axios, { AxiosResponse } from 'axios';
import queryString from 'query-string';

import { default as globalConfig } from '../config';
import { Routes } from '../constant';
import {
    SearchResponse,
    TrelloOrganization,
    TrelloWebhook,
    WebhookCreate,
} from '../types/trello';

export interface TrelloOptions {
    apiKey: string;
    token: string;
    workspace?: string;
}

export class TrelloClient {
    private readonly config: TrelloOptions;

    constructor(
        config: TrelloOptions
    ) {
        this.config = config;
    }

    public getListByBoard(boardId: string): Promise<any> {
        const queryParams: string = queryString.stringify({
            key: this.config.apiKey,
            token: this.config.token,
        });
        const url = `${globalConfig.TRELLO.URL}${Routes.TP.boards}/${boardId}/${Routes.TP.lists}?${queryParams}`;

        return axios.get(url).
            then((response: AxiosResponse<any>) => response.data);
    }

    public getBoardById(boardId: string): Promise<any> {
        const queryParams: string = queryString.stringify({
            key: this.config.apiKey,
            token: this.config.token,
        });
        const url = `${globalConfig.TRELLO.URL}${Routes.TP.boards}/${boardId}?${queryParams}`;

        return axios.get(url).
            then((response: AxiosResponse<any>) => response.data);
    }

    public searchBoardByName(boardName: string, idOrganizations: string): Promise<SearchResponse> {
        const queryParams: string = queryString.stringify({
            key: this.config.apiKey,
            token: this.config.token,
            query: boardName,
            modelTypes: Routes.TP.boards,
            idOrganizations,
        });
        const url = `${globalConfig.TRELLO.URL}${Routes.TP.search}?${queryParams}`;

        return axios.get(url).
            then((response: AxiosResponse<any>) => response.data);
    }

    public getOrganizationId(workspace: string): Promise<TrelloOrganization> {
        const queryParams: string = queryString.stringify({
            key: this.config.apiKey,
            token: this.config.token,
        });
        const url = `${globalConfig.TRELLO.URL}${Routes.TP.organizations}/${workspace}?${queryParams}`;

        return axios.get(url).
            then((response: AxiosResponse<any>) => response.data);
    }

    public searchBoardsInOrganization(workspace: string): Promise<any> {
        const queryParams: string = queryString.stringify({
            key: this.config.apiKey,
            token: this.config.token,
        });
        const url = `${globalConfig.TRELLO.URL}${Routes.TP.organizations}/${workspace}/${Routes.TP.boards}?${queryParams}`;

        return axios.get(url).
            then((response: AxiosResponse<any>) => response.data);
    }

    public sendCreateCardRequest(listId: string, cardName: string): Promise<any> {
        const queryParams: string = queryString.stringify({
            key: this.config.apiKey,
            token: this.config.token,
            name: cardName,
            idList: listId,
        });
        const url = `${globalConfig.TRELLO.URL}${Routes.TP.cards}?${queryParams}`;

        return axios.post(url).
            then((response: AxiosResponse<any>) => response.data);
    }

    public validateToken(workspace: string): Promise<any> {
        const queryParams: string = queryString.stringify({
            key: this.config.apiKey,
            token: this.config.token,
        });
        const verifyURL = `${globalConfig.TRELLO.URL}${Routes.TP.organizations}/${workspace}?${queryParams}`;

        return axios.get(verifyURL).
            then((response: AxiosResponse<any>) => response.data);
    }

    public createTrelloWebhook(payload: WebhookCreate): Promise<any> {
        const queryParams: string = queryString.stringify({
            key: this.config.apiKey,
            token: this.config.token,
        });
        const url = `${globalConfig.TRELLO.URL}${Routes.TP.tokens}/${this.config.token}/${Routes.TP.webhooks}?${queryParams}`;

        return axios.post(url, payload).
            then((response: AxiosResponse<any>) => response.data);
    }

    public getTrelloActiveWebhooks(): Promise<TrelloWebhook[]> {
        const queryParams: string = queryString.stringify({
            key: this.config.apiKey,
            token: this.config.token,
        });
        const token = this.config.token;
        const url = `${globalConfig.TRELLO.URL}${Routes.TP.tokens}/${token}/${Routes.TP.webhooks}?${queryParams}`;
        return axios.get(url).
            then((response: AxiosResponse<TrelloWebhook[]>) => response.data);
    }

    public deleteTrelloWebhook(hookId: string): Promise<any> {
        const queryParams: string = queryString.stringify({
            key: this.config.apiKey,
            token: this.config.token,
        });
        const url = `${globalConfig.TRELLO.URL}${Routes.TP.webhooks}/${hookId}?${queryParams}`;
        return axios.delete(url).
            then((response: AxiosResponse<TrelloWebhook[]>) => response.data);
    }

    public getTrelloWebhookByID(hookId: string): Promise<TrelloWebhook> {
        const queryParams: string = queryString.stringify({
            key: this.config.apiKey,
            token: this.config.token,
        });
        const url = `${globalConfig.TRELLO.URL}${Routes.TP.webhooks}/${hookId}?${queryParams}`;
        return axios.get(url).
            then((response: AxiosResponse<TrelloWebhook>) => response.data);
    }
}
