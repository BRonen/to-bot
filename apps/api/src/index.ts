import Koa from 'koa';

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Hello Wawdwadwadorld';
});

app.listen(3000, () => console.log('listening at http://localhost:3000/'));