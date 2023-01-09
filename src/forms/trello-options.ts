import { TrelloClient, TrelloOptions } from '../clients/trello';
import { ExceptionType } from '../constant';
import { AppContext, AppSelectOption } from '../types';
import { tryPromise } from '../utils';
import { configureI18n } from '../utils/translations';

export async function getBoardOptionList(trelloOptions: TrelloOptions, context: AppContext): Promise<AppSelectOption[]> {
    const i18nObj = configureI18n(context);
    const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
    const workspace = trelloOptions.workspace as string;

    const boards = await tryPromise(trelloClient.searchBoardsInOrganization(workspace), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));

    const options: AppSelectOption[] = [...boards.map((b: any) => {
        return { label: b.name, value: b.id };
    })];

    return options;
}

export async function getListOptionList(boardId: string, trelloOptions: TrelloOptions, context: AppContext): Promise<AppSelectOption[]> {
    const i18nObj = configureI18n(context);
    const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

    const boards = await tryPromise(trelloClient.getListByBoard(boardId), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));

    const options: AppSelectOption[] = [...boards.map((b: any) => {
        return { label: b.name, value: b.id };
    })];

    return options;
}