import { Request, Response } from 'express';

import { AppCallRequest, AppCallResponse } from '../types';
import { newFormCallResponse, newOKCallResponseWithMarkdown, showMessageToMattermost } from '../utils';
import { connectFormSaveToken, disconnectToken, getConnectForm } from '../forms/connect';

export const getConnect = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;
    let callResponse: AppCallResponse;

    try {
        const form = await getConnectForm(call);
        callResponse = newFormCallResponse(form);
        return response.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        return response.json(callResponse);
    }
};

export const saveToken = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;
    let callResponse: AppCallResponse;

    try {
        const message = await connectFormSaveToken(call);
        callResponse = newOKCallResponseWithMarkdown(message);
        return response.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        return response.json(callResponse);
    }
};

export const getDisconnect = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;
    let callResponse: AppCallResponse;

    try {
        const message = await disconnectToken(call);
        callResponse = newOKCallResponseWithMarkdown(message);
        return response.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        return response.json(callResponse);
    }
};

