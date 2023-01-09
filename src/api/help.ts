import { Request, Response } from 'express';

import manifest from '../manifest.json';
import {
    existsOauth2App,
    existsToken,
    isUserSystemAdmin,
    newOKCallResponseWithMarkdown,
} from '../utils';
import { AppActingUser, AppCallRequest, AppCallResponse, ExpandedBotActingUser, Oauth2App } from '../types';
import { addBulletSlashCommand, h5, joinLines } from '../utils/markdown';
import { Commands } from '../constant';
import { KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { configureI18n } from '../utils/translations';

export const getHelp = async (request: Request, response: Response) => {
    const call = request.body as AppCallRequest;

    const helpText = [
        getHeader(call),
        await getCommands(request.body),
    ].join('');
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);

    response.json(callResponse);
};

function getHeader(call: AppCallRequest): string {
    const i18nObj = configureI18n(call.context);
    return h5(i18nObj.__('api.help.header'));
}

async function getCommands(call: AppCallRequest): Promise<string> {
    const homepageUrl: string = manifest.homepage_url;
    const context = call.context as ExpandedBotActingUser;
    const actingUser: AppActingUser | undefined = context.acting_user;
    const commands: string[] = [];
    const i18nObj = configureI18n(call.context);
    const oauth2 = call.context.oauth2 as Oauth2App;

    commands.push(addBulletSlashCommand(Commands.HELP, i18nObj.__('api.help.command_help', { homepageUrl })));

    if (isUserSystemAdmin(<AppActingUser>actingUser)) {
        commands.push(addBulletSlashCommand(Commands.CONFIGURE, i18nObj.__('api.help.command_configure')));
    }
    if (existsOauth2App(oauth2)) {
        if (existsToken(oauth2)) {
            commands.push(addBulletSlashCommand(`${Commands.CARD} create`, i18nObj.__('api.help.command_create_description.command_add_subcription')));
            commands.push(addBulletSlashCommand(`${Commands.SUBSCRIPTION} add`, i18nObj.__('api.help.command_add_subcription')));
            commands.push(addBulletSlashCommand(`${Commands.SUBSCRIPTION} list`, i18nObj.__('api.help.command_list_subcription')));
            commands.push(addBulletSlashCommand(`${Commands.SUBSCRIPTION} remove`, i18nObj.__('api.help.command_stop_subcription')));
            commands.push(addBulletSlashCommand(`${Commands.DISCONNECT}`, i18nObj.__('api.help.command_disconnect')));
        } else {
            commands.push(addBulletSlashCommand(`${Commands.CONNECT}`, i18nObj.__('api.help.command_connect')));
        }
    }

    return `${joinLines(...commands)}`;
}
