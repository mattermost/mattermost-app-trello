import { Request, Response } from 'express';

import {
    newFormCallResponse,
    newOKCallResponseWithMarkdown,
    showMessageToMattermost,
} from '../utils';
import { AppCallRequest, AppCallResponse } from '../types';
import { addFromCommand, cardAddFromStepOne, cardAddFromStepTwo, submitCreateCard } from '../forms/card_add';

export const getAdd = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;
    let callResponse: AppCallResponse;

    try {
        if (call.values?.card_name && call.values?.board_name && call.values?.list_name) {
            const message = await addFromCommand(call);
            callResponse = newOKCallResponseWithMarkdown(message);
        } else {
            const form = await cardAddFromStepOne(call);
            callResponse = newFormCallResponse(form);
        }

        return response.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        return response.json(callResponse);
    }
};

export const formStepOne = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;
    let callResponse: AppCallResponse;

    try {
        const form = await cardAddFromStepTwo(call);
        callResponse = newFormCallResponse(form);
        return response.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        return response.json(callResponse);
    }
};

export const formStepTwo = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;
    let callResponse: AppCallResponse;

    try {
        const message = await submitCreateCard(call);
        callResponse = newOKCallResponseWithMarkdown(message);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
    }

    return response.json(callResponse);
};
