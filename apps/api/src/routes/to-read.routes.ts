import Router from "@koa/router";

import toreadController from "../controllers/to-read.controller";
import toreadKeywordsController from "../controllers/to-read-keywords.controller";

import createToReadRepository from "../repositories/to-read/knex.repository";
import createToReadKeywordsRepository from "../repositories/to-read-keywords/knex.repository";

const router = new Router({
  prefix: "/to-read",
});

router
  .get("/keywords", async (ctx) => {
    const repository = createToReadKeywordsRepository(ctx.db);

    const records = await toreadKeywordsController.index(repository);

    ctx.body = records;
  })
  .get("/keywords/:id", async (ctx) => {
    const repository = createToReadKeywordsRepository(ctx.db);

    const records = await toreadKeywordsController.show(
      repository,
      ctx.params.id
    );

    ctx.body = records;
  })
  .post("/keywords", async (ctx) => {
    const repository = createToReadKeywordsRepository(ctx.db);

    try {
      const records = await toreadKeywordsController.store(
        repository,
        ctx.request.body
      );

      ctx.body = records;
    } catch (e: any) {
      console.error(e);
      ctx.body = "Internal Server Error";
      ctx.status = 500;

      if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
        ctx.body = "Task Already Exists";
        ctx.status = 400;
      }
    }
  })
  .put("/keywords/:id", async (ctx) => {
    const repository = createToReadKeywordsRepository(ctx.db);

    try {
      const records = await toreadKeywordsController.update(
        repository,
        ctx.request.body,
        ctx.params.id
      );

      ctx.body = records;
    } catch (e: any) {
      console.error(e);
      ctx.body = "Internal Server Error";
      ctx.status = 500;
    }
  });

router
  .get("/", async (ctx) => {
    const repository = createToReadRepository(ctx.db);

    const records = await toreadController.index(repository);
    ctx.body = records;
  })
  .get("/:id", async (ctx) => {
    const repository = createToReadRepository(ctx.db);

    const record = await toreadController.show(repository, ctx.params.id);

    if (!record) {
      ctx.body = "User not found";
      ctx.status = 404;

      return;
    }

    ctx.body = record;
  })
  .post("/", async (ctx) => {
    const repository = createToReadRepository(ctx.db);

    try {
      const records = await toreadController.store(
        repository,
        ctx.request.body
      );
      ctx.body = records;
    } catch (e: any) {
      console.error(e);
      ctx.body = "Internal Server Error";
      ctx.status = 500;

      if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
        ctx.body = "Task Already Exists";
        ctx.status = 400;
      }
    }
  })
  .put("/:id", async (ctx) => {
    const repository = createToReadRepository(ctx.db);

    try {
      const records = await toreadController.update(
        repository,
        ctx.request.body,
        ctx.params.id
      );
      ctx.body = records;
    } catch (e: any) {
      console.error(e);
      ctx.body = "Internal Server Error";
      ctx.status = 500;
    }
  })
  .delete("/:id", async (ctx) => {
    const repository = createToReadRepository(ctx.db);

    try {
      const records = await toreadController.delete(repository, ctx.params.id);
      ctx.body = records;
    } catch (e: any) {
      console.error(e);
      ctx.body = "Internal Server Error";
      ctx.status = 500;
    }
  });

export default router;
