import cron from "node-cron";
import dotenv from "dotenv";
import { Asset } from "../db/models/Asset.model";
import { Transaction } from "../db/models/Transaction.model";
import { FireblocksService } from "../services/fireblocks/fireblocks.service";

dotenv.config();

const fireblocksService = new FireblocksService();

const fromTime = Date.now() - 24 * 60 * 60 * 1000;
const toTime = Date.now();

export const reconcileFunc = async () => {
  try {
    const assets = await Asset.findAll();
    const txHistory = await fireblocksService.fireblocksSDK.transactions.getTransactions({
      after: `${fromTime}`,
      before: `${toTime}`,
      status: "COMPLETED",
      orderBy: "createdAt",
      sort: "DESC",
      limit: 500
    });

    if (txHistory.data.length === 0) throw new Error("No Fireblocks transaction history in the past 24h");

    for (const asset of assets) {
      try {
        const { assetId, address, vaultId, leumiWalletId } = asset;
        if (!vaultId) {
          console.warn(`Asset ${asset.id} has no vaultId`);
          continue;
        }

        const isUTXO = assetId === "BTC_TEST";
        const fbIdentifier = isUTXO ? address.toLowerCase() : vaultId;

        const incomeFbTxs = txHistory.data.filter(tx =>
          isUTXO ? tx.destinationAddress === fbIdentifier : tx.destination?.id === fbIdentifier
        );
        const totalFbIncome = incomeFbTxs.reduce((sum, tx) => sum + parseFloat(tx?.amountInfo?.amount || "0"), 0);

        const outgoingFbTxs = txHistory.data.filter(tx =>
          isUTXO ? tx.externalTxId?.includes(leumiWalletId) : tx.source?.id === fbIdentifier
        );
        const totalFbOutgoing = outgoingFbTxs.reduce((sum, tx) => sum + parseFloat(tx?.amountInfo?.amount || "0"), 0);

        const fbBalance = totalFbIncome - totalFbOutgoing;

        const incomeDBTxs = await Transaction.findAll({
          where: {
            destination: fbIdentifier,
            assetId
          }
        });
        const totalDbIncome = incomeDBTxs.reduce((sum, tx) => sum + tx.amount, 0);

        const outgoingDBTxs = await Transaction.findAll({
          where: {
            source: fbIdentifier,
            assetId
          }
        });
        const totalDbOutgoing = outgoingDBTxs.reduce((sum, tx) => sum + tx.amount, 0);

        const dbBalance = totalDbIncome - totalDbOutgoing;

        // LOG COMPARISON
        const label = isUTXO ? "(UTXO)" : "(Account)";
        const diff = Math.abs(fbBalance - dbBalance);
        const msg = `Asset ${assetId} ${label} — FB: ${fbBalance}, DB: ${dbBalance}`;

        if (diff > 0.01) {
          console.warn(`Discrepancy: ${msg}`);
        } else {
          console.log(`Match: ${msg}`);
        }
      } catch (err) {
        console.error(`Reconciliation failed for asset ${asset.assetId}:`, err);
      }
    }

    console.log("Reconciliation complete");
  } catch (error) {
    console.error("Error in reconciliation process:", error);
  }
};

// export const reconcileFunc = async () => {
//   try {
//     const assets = await Asset.findAll();
//     const txHistory = await fireblocksService.fireblocksSDK.transactions.getTransactions({
//       after: `${fromTime}`,
//       before: `${toTime}`,
//       orderBy: "createdAt",
//       sort: "DESC",
//       limit: 500
//     });

//     if (txHistory.data.length === 0) {
//       throw new Error("no fireblocks-tx history in the past 24h");
//     }

//     for (const asset of assets) {
//       try {
//         console.log("current asset", asset.assetId);
//         const isUTXO = asset.assetId === "BTC_TEST";
//         const fbVaultId = asset.vaultId;

//         if (!fbVaultId) {
//           console.warn(`Asset ${asset.id} has no vaultId`);
//           continue;
//         }

//         if (isUTXO) {
//           const userAddress = asset.address.toLowerCase();

//           const incomeFbTxs = txHistory.data.filter(tx => tx.destinationAddress === userAddress);

//           const totalFbIncome = incomeFbTxs.reduce(
//             (total, transaction) => total + parseFloat(transaction?.amountInfo?.amount || ""),
//             0
//           );

//           console.log(incomeFbTxs, totalFbIncome);
//           const outgoingFbTxs = txHistory.data.filter(tx => tx.externalTxId?.includes(asset.leumiWalletId));

//           const totalFbOutgoing = outgoingFbTxs.reduce(
//             (total, transaction) => total + parseFloat(transaction?.amountInfo?.amount || ""),
//             0
//           );

//           console.log(outgoingFbTxs, totalFbOutgoing);
//           const fbBalance = totalFbIncome - totalFbOutgoing;

//           const incomeDBTxs = await Transaction.findAll({
//             where: {
//               destination: asset.address.toLowerCase(),
//               assetId: asset.assetId
//             }
//           });
//           const totalDbIncome = incomeDBTxs.reduce((total, tx) => total + tx.amount, 0);

//           const outgoingDBTxs = await Transaction.findAll({
//             where: {
//               source: asset.address.toLowerCase(),
//               assetId: asset.assetId
//             }
//           });
//           const totalDbOutgoing = outgoingDBTxs.reduce((total, tx) => total + tx.amount, 0);
//           const dbBalance = totalDbIncome - totalDbOutgoing;
//           if (Math.abs(fbBalance - dbBalance) > 0.01) {
//             // Tolerance of 0.01 for rounding differences
//             console.warn(
//               `Discrepancy found for asset ${asset.assetId}. FB Balance: ${fbBalance}, DB Balance: ${dbBalance}`
//             );
//           } else {
//             console.log(
//               `Balances match for asset ${asset.assetId}. FB Balance: ${fbBalance}, DB Balance: ${dbBalance}`
//             );
//           }
//         } else {
//           const userVaultId = asset.vaultId;

//           // Filter Fireblocks transactions for incoming transactions to the vault
//           const incomeFbTxs = txHistory.data.filter(tx => tx.destination?.id === userVaultId);
//           const totalFbIncome = incomeFbTxs.reduce(
//             (total, transaction) => total + parseFloat(transaction?.amountInfo?.amount || ""),
//             0
//           );

//           console.log("Income from Fireblocks:", incomeFbTxs, totalFbIncome);

//           // Filter Fireblocks transactions for outgoing transactions from the vault
//           const outgoingFbTxs = txHistory.data.filter(tx => tx.source?.id === userVaultId);
//           const totalFbOutgoing = outgoingFbTxs.reduce(
//             (total, transaction) => total + parseFloat(transaction?.amountInfo?.amount || ""),
//             0
//           );

//           console.log("Outgoing to Fireblocks:", outgoingFbTxs, totalFbOutgoing);

//           // Calculate Fireblocks balance for the vault (account-based)
//           const fbBalance = totalFbIncome - totalFbOutgoing;
//           console.log("Fireblocks Balance (Account-Based):", fbBalance);

//           // Fetch incoming transactions from the database
//           const incomeDBTxs = await Transaction.findAll({
//             where: {
//               destination: userVaultId,
//               assetId: asset.assetId
//             }
//           });
//           const totalDbIncome = incomeDBTxs.reduce((total, tx) => total + tx.amount, 0);

//           // Fetch outgoing transactions from the database
//           const outgoingDBTxs = await Transaction.findAll({
//             where: {
//               source: userVaultId,
//               assetId: asset.assetId
//             }
//           });
//           const totalDbOutgoing = outgoingDBTxs.reduce((total, tx) => total + tx.amount, 0);

//           console.log("Income from DB:", incomeDBTxs, totalDbIncome);
//           console.log("Outgoing from DB:", outgoingDBTxs, totalDbOutgoing);

//           // Calculate the DB balance (account-based)
//           const dbBalance = totalDbIncome - totalDbOutgoing;
//           console.log("DB Balance (Account-Based):", dbBalance);

//           // Compare Fireblocks and DB balance
//           if (Math.abs(fbBalance - dbBalance) > 0.01) {
//             // Tolerance of 0.01 for rounding differences
//             console.warn(
//               `Discrepancy found for asset ${asset.assetId}. FB Balance: ${fbBalance}, DB Balance: ${dbBalance}`
//             );
//           } else {
//             console.log(
//               `Balances match for asset ${asset.assetId}. FB Balance: ${fbBalance}, DB Balance: ${dbBalance}`
//             );
//           }
//         }
//       } catch (err) {
//         console.error(`Reconciliation failed for asset ${asset.id}:`, err);
//       }
//     }

//     console.log("Reconciliation complete");
//   } catch (error) {
//     console.error("Error in reconciliation process:", error);
//   }
// };

// Schedule a daily reconciliation job
cron.schedule("0 23 * * *", reconcileFunc, {
  scheduled: true,
  timezone: "Asia/Jerusalem"
});
