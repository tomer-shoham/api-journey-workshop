import { WebhookService } from "../services/webhook.service";
import { Request, Response } from "express";
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  public async handleWebhook(req: Request, res: Response) {
    await this.webhookService.handleWebhook();
    res.sendStatus(200);
  }
}
