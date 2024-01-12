import Router from "@koa/router";
import type { DefaultState } from "koa";

import createToReadRepository from "@to-bot/database/repositories/to-read.repository";
import createToReadKeywordsRepository from "@to-bot/database/repositories/to-read-keywords.repository";

import toreadController from "../controllers/to-read.controller";
import toreadKeywordsController from "../controllers/to-read-keywords.controller";

import { AppContext } from "../types";

const router = new Router<DefaultState, AppContext>({ prefix: "/to-read" });

router
  .get("/keywords", async (ctx) => {
    const repository = createToReadKeywordsRepository(ctx.database);

    const records = await toreadKeywordsController.index(repository);

    ctx.body = records;
  })
  .get("/keywords/:id", async (ctx) => {
    const repository = createToReadKeywordsRepository(ctx.database);

    const records = await toreadKeywordsController.show(
      repository,
      ctx.params.id
    );

    ctx.body = records;
  })
  .post("/keywords", async (ctx) => {
    const repository = createToReadKeywordsRepository(ctx.database);

    const records = await toreadKeywordsController.store(
      repository,
      ctx.request.body
    );

    ctx.body = records;
  })
  .put("/keywords/:id", async (ctx) => {
    const repository = createToReadKeywordsRepository(ctx.database);

    const records = await toreadKeywordsController.update(
      repository,
      ctx.request.body,
      ctx.params.id
    );

    ctx.body = records;
  })
  .delete("/keywords/:id", async (ctx) => {
    const repository = createToReadKeywordsRepository(ctx.database);

    const records = await toreadKeywordsController.delete(
      repository,
      ctx.params.id
    );

    ctx.body = records;
  });

router
  .get("/", async (ctx) => {
    const { page, per_page, order_by, tags } = ctx.query;
    const repository = createToReadRepository(ctx.database);

    const records = await toreadController.index(repository, {
      page,
      per_page,
      order_by,
      tags,
    });
    ctx.body = records;
  })
  .get("/:id", async (ctx) => {
    const repository = createToReadRepository(ctx.database);

    const record = await toreadController.show(repository, ctx.params.id);

    if (!record) {
      ctx.body = "User not found";
      ctx.status = 404;

      return;
    }

    ctx.body = record;
  })
  .post("/", async (ctx) => {
    const repository = createToReadRepository(ctx.database);

    const records = await toreadController.store(
      repository,
      ctx.request.body
    );
    ctx.body = records;
  })
  .put("/:id", async (ctx) => {
    const repository = createToReadRepository(ctx.database);

    const records = await toreadController.update(
      repository,
      ctx.request.body,
      ctx.params.id
    );
    ctx.body = records;
  })
  .delete("/:id", async (ctx) => {
    const repository = createToReadRepository(ctx.database);

    const records = await toreadController.delete(repository, ctx.params.id);
    ctx.body = records;
  });

export default router;
