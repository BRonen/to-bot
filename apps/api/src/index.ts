import knex from "knex";

import routes from "./routes";
import { environment, dbConfig } from "./env";
import { createApp } from "./app";

const db = knex(dbConfig);

createApp(routes, db, environment).listen(environment.PORT, () =>
  console.log(`listening at http://localhost:${environment.PORT}/`)
);
