import express from "express";
import cors from "cors";
import { config } from "./config";
import { DbClient } from "./db/db";
import { MainModule } from "./modules/main.module";
import { MainRouter } from "./router/main.router";
import { startRebalanceJob } from "./jobs/rebalanceJob";
import { startSolStakingJob } from "./jobs/solStakingJob";
import { startReconciliationJob } from "./jobs/reconcileBalancesJob";

export const db = new DbClient();

(async () => {
  const app = express();
  app.use(
    cors({
      origin: ["http://localhost:8080"],
      credentials: true,
      exposedHeaders: ["Authorization"]
    })
  );
  app.use(express.json());
  await db.authenticate();

  //reset db
  // await db.reset();

  await db.connect();

  const mainModule = new MainModule();
  const mainRouter = new MainRouter(mainModule);
  app.use("", mainRouter.router);

  startRebalanceJob();

  startSolStakingJob();

  startReconciliationJob();

  app.listen(config.port, () => {
    console.log(`🚀 Leumi Server running on PORT ${config.port}`);
  });
})();
