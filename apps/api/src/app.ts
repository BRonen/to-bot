import Koa from "koa";

import bodyParser from "@koa/bodyparser";
import Router from "@koa/router";

import { Knex } from "knex";

import { ApiEnvironment } from "@to-bot/env";

export const createApp = (
  routes: Router,
  db: Knex,
  _environment: ApiEnvironment
) => {
  const app = new Koa();

  return app
    .use(bodyParser())
    .use(async (ctx, next) => {
      ctx.db = db;
      await next();
    })
    .use(routes.routes())
    .use(routes.allowedMethods());
};
