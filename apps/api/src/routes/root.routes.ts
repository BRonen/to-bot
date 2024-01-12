import Router from "@koa/router";
import type { DefaultState } from "koa";
import { AppContext } from "../types";

const router = new Router<DefaultState, AppContext>();

router.get("/", async (ctx) => {
  ctx.body = "healthy";
});

export default router;
