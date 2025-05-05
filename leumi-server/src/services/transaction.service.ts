import { Transaction } from "../db/models/Transaction.model";

import { FireblocksService } from "./fireblocks/fireblocks.service";

export class TransactionService {
  constructor(private readonly fireblocksService: FireblocksService) {}
  public async getTransactions(leumiWalletId: string) {
    try {
      const transactions = await Transaction.findAll({
        where: {
          leumiWalletId: leumiWalletId
        }
      });
      console.log("transactions", transactions);
      return transactions.map(transaction => transaction.toJSON());
    } catch (err) {
      console.error(`Error fetching TXs - ${(err as any).message || JSON.stringify(err)}`);
    }
  }
}
