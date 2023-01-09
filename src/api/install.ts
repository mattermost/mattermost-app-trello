import { Request, Response } from 'express';

import { AppCallRequest, AppCallResponse } from '../types';
import { newOKCallResponseWithMarkdown } from '../utils';
import { MattermostClient, MattermostOptions } from '../clients/mattermost';
import { joinLines } from '../utils/markdown';
import manifest from '../manifest.json';
import { configureI18n } from '../utils/translations';

export const getInstall = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.acting_user_access_token;
    const userId: string | undefined = call.context.bot_user_id;

    const mattermostOpts: MattermostOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const mattermostClient: MattermostClient = new MattermostClient(mattermostOpts);

    await mattermostClient.updateRolesByUser(<string>userId, 'system_admin system_post_all');

    const helpText: string = [
        getCommands(request.body),
    ].join('');
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);

    response.json(callResponse);
};

function getCommands(call: AppCallRequest): string {
    const i18nObj = configureI18n(call.context);
    const homepageUrl: string = manifest.homepage_url;
    return `${joinLines(
        i18nObj.__('api.install.description', { homepageUrl })
    )}\n`;
}
