import { TrelloClient, TrelloOptions } from '../clients/trello';
import { AppExpandLevels, AppFieldTypes, ExceptionType, Routes, TrelloIcon } from '../constant';
import { AppCallRequest, AppCallValues, AppContext, AppField, AppForm, AppSelectOption, Oauth2App } from '../types';
import { existsOauth2App, existsToken, tryPromise } from '../utils';
import { Exception } from '../utils/exception';
import { configureI18n } from '../utils/translations';

import { getBoardOptionList, getListOptionList } from './trello-options';

export async function cardAddFromStepOne(call: AppCallRequest): Promise<AppForm> {
    const i18nObj = configureI18n(call.context);
    const oauth2 = call.context.oauth2 as Oauth2App;
    const oauth2_token = oauth2.user?.token as string;
    const workspace = oauth2.data?.workspace as string;

    if (!existsOauth2App(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_1'));
    }

    if (!existsToken(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_2'));
    }

    const trelloOptions: TrelloOptions = {
        apiKey: oauth2.client_id,
        token: oauth2_token,
        workspace,
    };
    return getCreateCardForm(trelloOptions, call.context);
}

export async function cardAddFromStepTwo(call: AppCallRequest): Promise<AppForm> {
    const board = call.values?.board;
    const card_name = call.values?.card_name;
    const i18nObj = configureI18n(call.context);
    const oauth2 = call.context.oauth2 as Oauth2App;
    const oauth2_token = oauth2.user?.token as string;
    const workspace = oauth2.data?.workspace as string;

    if (!existsOauth2App(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_1'));
    }

    if (!existsToken(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_2'));
    }

    const trelloOptions = {
        apiKey: oauth2.client_id,
        token: oauth2_token,
        workspace,
    };

    return getCreateCardForm(trelloOptions, call.context, card_name, board);
}

async function getCreateCardForm(trelloOptions: TrelloOptions, context: AppContext, card_name?: string, board?: AppSelectOption): Promise<AppForm> {
    const board_options: AppSelectOption[] = await getBoardOptionList(trelloOptions, context);
    let list_options: AppSelectOption[] = [];
    const i18nObj = configureI18n(context);

    if (board) {
        list_options = await getListOptionList(board?.value, trelloOptions, context);
    }

    const fields: AppField[] = [
        {
            type: AppFieldTypes.TEXT,
            name: 'card_name',
            modal_label: i18nObj.__('forms.card_add.create.label_card'),
            value: card_name || '',
            description: i18nObj.__('forms.card_add.create.description_card'),
            is_required: true,
        },
        {
            name: 'board',
            modal_label: i18nObj.__('forms.card_add.create.label_board'),
            refresh: true,
            value: board || null,
            type: AppFieldTypes.STATIC_SELECT,
            options: board_options,
            is_required: true,
        },
    ];

    if (board) {
        fields.push({
            name: 'list_select',
            modal_label: i18nObj.__('forms.card_add.create.label_select'),
            type: AppFieldTypes.STATIC_SELECT,
            options: list_options,
            is_required: true,
        });
    }

    const extra_text = Boolean(board_options.length) ? '' : i18nObj.__('forms.card_add.create.extra_text');
    const form: AppForm = {
        title: i18nObj.__('forms.card_add.create.new_card'),
        header: i18nObj.__('forms.card_add.create.header_card') + extra_text,
        icon: TrelloIcon,
        fields,
        submit_label: 'next',
        submit: {
            path: `${Routes.App.Forms}${Routes.App.BindingPathCreateCard}${Routes.App.Submit}`,
            expand: {
                acting_user: AppExpandLevels.EXPAND_ALL,
                acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                oauth2_app: AppExpandLevels.EXPAND_ALL,
                oauth2_user: AppExpandLevels.EXPAND_ALL,
            },
        },
        source: {
            path: `${Routes.App.Forms}${Routes.App.BindingPathCreateCard}${Routes.App.Form}`,
            expand: {
                acting_user: AppExpandLevels.EXPAND_ALL,
                acting_user_access_token: AppExpandLevels.EXPAND_ALL,
                oauth2_app: AppExpandLevels.EXPAND_ALL,
                oauth2_user: AppExpandLevels.EXPAND_ALL,
            },
        },
    };

    return form;
}

export async function addFromCommand(call: AppCallRequest): Promise<string> {
    const values: AppCallValues | undefined = call.values;
    const i18nObj = configureI18n(call.context);
    const oauth2 = call.context.oauth2 as Oauth2App;
    const oauth2_token = oauth2.user?.token as string;

    const board_name: string = values?.board_name;
    const card_name: string = values?.card_name;
    const list_name: string = values?.list_name;

    if (!existsOauth2App(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_1'));
    }

    if (!existsToken(oauth2)) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_2'));
    }

    const trelloOptions: TrelloOptions = {
        apiKey: oauth2.client_id,
        token: oauth2_token,
        workspace: oauth2.data?.workspace,
    };

    const boards = await getBoardOptionList(trelloOptions, call.context);
    const board = boards.find((b) => b.label === board_name);
    if (board) {
        const lists = await getListOptionList(board.value, trelloOptions, call.context);
        const list = lists.find((l) => l.label === list_name);
        if (list) {
            const trelloClient = new TrelloClient(trelloOptions);
            await tryPromise(trelloClient.sendCreateCardRequest(list.value, card_name), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));
        } else {
            throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add.list_not_found', { name: list_name }));
        }
    } else {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add.board_not_found', { nbame: board_name }));
    }

    return i18nObj.__('api.add');
}

export async function submitCreateCard(call: AppCallRequest): Promise<string> {
    const i18nObj = configureI18n(call.context);
    const list = call.values?.list_select;
    const oauth2 = call.context.oauth2 as Oauth2App;
    const oauth2_token = oauth2.user?.token as string;

    if (!list) {
        throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('api.form_step_two_exception'));
    }

    const list_id = list.value as string;
    const card_name = call.values?.card_name as string;

    const trelloOptions = {
        apiKey: oauth2.client_id,
        token: oauth2_token,
        workspace: oauth2.data?.workspace,
    };

    const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

    await tryPromise(trelloClient.sendCreateCardRequest(list_id, card_name), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));
    return i18nObj.__('api.add');
}
