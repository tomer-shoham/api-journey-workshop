import { FireblocksService } from "./fireblocks/fireblocks.service";
export class WebhookService {
  constructor(private readonly fireblocksService: FireblocksService) {}
  public async handleWebhook() {}
}
