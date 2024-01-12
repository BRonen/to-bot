import Koa from "koa";

import bodyParser from "@koa/bodyparser";
import Router from "@koa/router";

import { Knex } from "knex";

import type { ApiEnvironment } from "@to-bot/env";
import type { AppContext, Database } from "./types";

export const createApp = (
  routes: Router,
  db: Knex,
  database: Database,
  _environment: ApiEnvironment
) => {
  const app = new Koa<Koa.DefaultState, AppContext>();

  return app
    .use(bodyParser())
    .use(async (ctx, next) => {
      ctx.db = db;
      ctx.database = database;
      await next();
    })
    .use(routes.routes())
    .use(routes.allowedMethods());
};
