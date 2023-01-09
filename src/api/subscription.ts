import { Request, Response } from 'express';

import {
    newOKCallResponseWithMarkdown,
    showMessageToMattermost,
} from '../utils';
import {
    AppCallRequest,
    AppCallResponse,
    AppContext,
    TrelloWebhook,
} from '../types';
import { addSubscriptionCall, listWebhookCall, removeWebhookCall } from '../forms/subscriptions';
import { configureI18n } from '../utils/translations';

export const addWebhookSubscription = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;
    let callResponse: AppCallResponse;
    const i18nObj = configureI18n(call.context);

    try {
        await addSubscriptionCall(call);
        callResponse = newOKCallResponseWithMarkdown(i18nObj.__('api.subscription.response_add'));
        response.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        response.json(callResponse);
    }
};

export const removeWebhookSubscription = async (req: Request, res: Response) => {
    const call: AppCallRequest = req.body;
    let callResponse: AppCallResponse;
    const i18nObj = configureI18n(call.context);

    try {
        await removeWebhookCall(call);
        callResponse = newOKCallResponseWithMarkdown(i18nObj.__('api.subscription.response_remove'));
        res.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        res.json(callResponse);
    }
};

export const getWebhookSubscriptions = async (req: Request, res: Response) => {
    const call: AppCallRequest = req.body;
    let callResponse: AppCallResponse;

    try {
        const message = await listWebhookCall(call);
        callResponse = newOKCallResponseWithMarkdown(message);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
    }
    res.json(callResponse);
};
