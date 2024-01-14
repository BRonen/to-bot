import cron from "node-cron";

import { createConnection } from "@to-bot/database";
import { loadSchedulerEnvironment } from "@to-bot/env";
import { createApp } from "./app";
import routes from "./routes";
import { clearCronJobs, setupCronJobs } from "./cron";

(async () => {
  const env = await loadSchedulerEnvironment();
  const database = createConnection(env.DATABASE_URI);

  await clearCronJobs(cron);
  await setupCronJobs(cron, database);

  const app = createApp(routes, database, cron, env); 
  
  app.listen(env.PORT, () => console.log(`listening at http://0.0.0.0:${env.PORT}/`));
})();