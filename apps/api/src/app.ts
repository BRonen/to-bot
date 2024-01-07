import Koa from "koa";

import bodyParser from "@koa/bodyparser";
import Router from "@koa/router";

import { Knex } from "knex";

import { Environment } from "./env";

export const createApp = (
  routes: Router,
  db: Knex,
  _environment: Environment
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
