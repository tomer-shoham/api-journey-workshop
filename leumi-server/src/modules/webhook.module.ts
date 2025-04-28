import { WebhookRouter } from "../router/webhook.router";
import { WebhookController } from "../controllers/webhook.controller";

export class WebhookModule {
  public webhookRouter: WebhookRouter;
  constructor(webhookController: WebhookController) {
    this.webhookRouter = new WebhookRouter(webhookController);
  }
}
