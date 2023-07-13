import Koa from "koa";
import bodyParser from "@koa/bodyparser";

import knex from "knex";
import knexConfig from "../knexfile";

import routes from "./routes";

const db = knex(knexConfig["development"]);

const app = new Koa();
app.use(bodyParser());

app.use(async (ctx, next) => {
  ctx.db = db;
  await next();
});

app.use(routes.routes()).use(routes.allowedMethods());

app.listen(3000, () => console.log("listening at http://localhost:3000/"));
