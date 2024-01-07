import knex from "knex";

import routes from "./routes";
import { loadApiEnvironment, loadDatabaseEnvironment } from "env";
import { createApp } from "./app";

const db = knex(loadDatabaseEnvironment());

const env = loadApiEnvironment();

createApp(routes, db, env).listen(env.PORT, () =>
  console.log(`listening at http://localhost:${env.PORT}/`)
);
