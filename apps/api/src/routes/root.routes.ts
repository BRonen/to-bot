import Router from "@koa/router";

const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "healthy";
});

export default router;
