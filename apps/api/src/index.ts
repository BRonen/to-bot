import knex from "knex";

import routes from "./routes";
import { loadApiEnvironment, loadDatabaseEnvironment } from "@to-bot/env";
import { createApp } from "./app";
import { createConnection } from "@to-bot/database";

(async () => {
  const env = await loadApiEnvironment();

  const db = knex(await loadDatabaseEnvironment(env.DATABASE_CONFIG));

  const database = createConnection(env.DATABASE_URI);

  createApp(routes, db, database, env).listen(env.PORT, () =>
    console.log(`listening at http://0.0.0.0:${env.PORT}/`)
  );
})();
