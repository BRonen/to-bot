import knex from "knex";

import routes from "./routes";
import { loadApiEnvironment, loadDatabaseEnvironment } from "@to-bot/env";
import { createApp } from "./app";

const env = loadApiEnvironment();

const db = knex(loadDatabaseEnvironment(env.DATABASE_CONFIG));

createApp(routes, db, env).listen(env.PORT, () =>
  console.log(`listening at http://localhost:${env.PORT}/`)
);
