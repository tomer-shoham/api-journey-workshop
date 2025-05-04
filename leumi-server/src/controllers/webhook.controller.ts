import { WebhookService } from "../services/webhook.service";
import { Request, Response } from "express";
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  public async handleWebhook(req: Request, res: Response) {
    try {
      console.log("webhook req", req.body);
      const { type, data } = req.body;
      await this.webhookService.handleWebhook(type, data);
      res.sendStatus(200);
    } catch (e) {
      console.error(e);
      res.sendStatus(400);
    }
  }
}
