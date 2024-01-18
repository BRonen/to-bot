import Router from "@koa/router";
import type { DefaultState } from "koa";
import { AppContext } from "./types";

const routes = new Router<DefaultState, AppContext>();

routes.get("/", (ctx) => {
  ctx.body = "healthy";
});

routes.get("/test", (ctx) => {
  console.log("manual", new Date().toUTCString());
  console.log("wasd", ctx.cron.getTasks());
  ctx.body = "manual";
});

export default routes;
