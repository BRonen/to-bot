import Koa, { type DefaultState } from "koa";

import bodyParser from "@koa/bodyparser";
import Router from "@koa/router";

import type { ApiEnvironment } from "@to-bot/env";
import type { AppContext, Database } from "./types";

export const createApp = (
  routes: Router<DefaultState, AppContext>,
  database: Database,
  _environment: ApiEnvironment
) => {
  const app = new Koa<DefaultState, AppContext>();

  return app
    .use(bodyParser())
    .use(async (ctx, next) => {
      ctx.database = database;
      await next();
    })
    .use(routes.routes())
    .use(routes.allowedMethods());
};
