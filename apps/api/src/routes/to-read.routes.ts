import Router from '@koa/router';

import toreadController from '../controllers/to-read.controller';
import toreadKeywordsController from '../controllers/to-read-keywords.controller';

const router = new Router({
  prefix: '/to-read',
});

router
  .get('/', async (ctx) => {
    const records = await toreadController.index(ctx.db);
    ctx.body = records;
  })
  .post('/', async (ctx) => {
    try {
      const records = await toreadController.create(ctx.db, ctx.request.body);
      ctx.body = records;
    } catch (e: any) {
      console.error(e);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;

      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        ctx.body = 'Task Already Exists';
        ctx.status = 400;
      }
    }
  })
  .put('/', async (ctx) => {
    try {
      const records = await toreadController.update(
        ctx.db,
        ctx.request.body,
        ctx.request.body.url
      );
      ctx.body = records;
    } catch (e: any) {
      console.error(e);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  });

router
  .get('/keywords', async (ctx) => {
    const records = await toreadKeywordsController.index(ctx.db);
    ctx.body = records;
  })
  .post('/keywords', async (ctx) => {
    try {
      const records = await toreadKeywordsController.create(
        ctx.db,
        ctx.request.body
      );
      ctx.body = records;
    } catch (e: any) {
      console.error(e);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;

      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        ctx.body = 'Task Already Exists';
        ctx.status = 400;
      }
    }
  })
  .put('/keywords/:id', async (ctx) => {
    try {
      const records = await toreadKeywordsController.update(
        ctx.db,
        ctx.request.body,
        ctx.params.id
      );
      ctx.body = records;
    } catch (e: any) {
      console.error(e);
      ctx.body = 'Internal Server Error';
      ctx.status = 500;
    }
  });

export default router;
