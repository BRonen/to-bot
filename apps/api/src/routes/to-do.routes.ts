import Router from "@koa/router";
import type { DefaultState } from "koa";
import { AppContext } from "../types";

const router = new Router<DefaultState, AppContext>({ prefix: "/to-do" });

router.get("/", async (ctx) => {
  ctx.body = "hello world";
});

export default router;
