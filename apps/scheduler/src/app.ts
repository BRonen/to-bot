import Koa, { type DefaultState } from "koa";

import bodyParser from "@koa/bodyparser";
import Router from "@koa/router";

import type { ApiEnvironment } from "@to-bot/env";
import type { AppContext, Database, Cron } from "./types";

export const createApp = (
  routes: Router<DefaultState, AppContext>,
  database: Database,
  cron: Cron,
  _environment: ApiEnvironment
) => {
  const app = new Koa<DefaultState, AppContext>()
    .use(bodyParser())
    .use(async (ctx, next) => {
      ctx.database = database;
      ctx.cron = cron;
      await next();
    })
    .use(routes.routes())
    .use(routes.allowedMethods());
  return app
};