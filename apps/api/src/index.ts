import knex from "knex";

import routes from "./routes";
import { loadApiEnvironment, loadDatabaseEnvironment } from "@to-bot/env";
import { createApp } from "./app";

(async () => {
  const env = await loadApiEnvironment();
  
  const db = knex(await loadDatabaseEnvironment(env.DATABASE_CONFIG));
  
  createApp(routes, db, env).listen(env.PORT, () =>
    console.log(`listening at http://0.0.0.0:${env.PORT}/`)
  );
})();
