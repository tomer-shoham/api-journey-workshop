import { FireblocksService } from "./fireblocks/fireblocks.service";
export class TransactionService {
  constructor(private readonly fireblocksService: FireblocksService) {}
  public async getTransactions() {
    return [];
  }
}
