import Router from "@koa/router";

const router = new Router({ prefix: "/to-do" });

router.get("/", async (ctx) => {
  ctx.body = "hello world";
});

export default router;
