import { AppContext } from './apps';
import { TrelloWebhookResponse, WebhookRequest } from './trello';

export type WebhookFunction = (event: WebhookRequest<TrelloWebhookResponse>, context: AppContext) => Promise<void>;