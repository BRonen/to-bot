import Koa, { type DefaultState } from "koa";

import bodyParser from "@koa/bodyparser";
import cors from "@koa/cors";
import Router from "@koa/router";

import type { loadApiEnvironment } from "@to-bot/env";
import type { AppContext, Database, Cron } from "./types";

export const createApp = (
  routes: Router<DefaultState, AppContext>,
  database: Database,
  cron: Cron,
  _environment: ReturnType<typeof loadApiEnvironment>
) => {
  const app = new Koa<DefaultState, AppContext>()
    .use(bodyParser())
    .use(cors())
    .use(async (ctx, next) => {
      ctx.database = database;
      ctx.cron = cron;
      await next();
    })
    .use(routes.routes())
    .use(routes.allowedMethods());
  return app;
};
