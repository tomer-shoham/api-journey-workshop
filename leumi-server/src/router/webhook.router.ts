import { Router } from "express";
import { WebhookController } from "../controllers/webhook.controller";

export class WebhookRouter {
  public router = Router();
  constructor(webhookController: WebhookController) {
    this.router.post("/", (req, res) => webhookController.handleWebhook(req, res));
  }
}
