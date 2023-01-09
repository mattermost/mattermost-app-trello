import { Request } from 'express';

import { AppCallResponse, AppForm } from '../types';
import { AppCallResponseTypes } from '../constant';

export type FieldValidationErrors = {[name: string]: string};

export type CallResponseHandler = (
    req: Request,
    res: {
        json: (
            callResponse: AppCallResponse
        ) => void}
) => Promise<void>;

export function newOKCallResponse(): AppCallResponse {
    return {
        type: AppCallResponseTypes.OK,
    };
}

export function newOKCallResponseWithMarkdown(markdown: string): AppCallResponse {
    return {
        type: AppCallResponseTypes.OK,
        text: markdown,
    };
}

export function newOKCallResponseWithData(data: unknown): AppCallResponse {
    return {
        type: AppCallResponseTypes.OK,
        data,
    };
}

export function newFormCallResponse(form: AppForm): AppCallResponse {
    return {
        type: AppCallResponseTypes.FORM,
        form,
    };
}

export function newErrorCallResponseWithMessage(message: string): AppCallResponse {
    return {
        type: AppCallResponseTypes.ERROR,
        text: message,
    };
}

export function newErrorCallResponseWithFieldErrors(errors: FieldValidationErrors): AppCallResponse {
    return {
        type: AppCallResponseTypes.ERROR,
        data: {
            errors,
        },
    };
}
