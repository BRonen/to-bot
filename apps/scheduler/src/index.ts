import Koa, { type DefaultState, type DefaultContext } from "koa";
import bodyParser from "@koa/bodyparser";
import Router from "@koa/router";
import cron from "node-cron";

const routes = new Router();

cron.schedule(
  "* * * * * *",
  () => {
    console.log("auto", new Date().toUTCString());
  },
  {
    name: "wasd",
  }
);

console.log(cron.getTasks().get("wasd"));
console.log(cron.getTasks().get(cron.getTasks().keys().next().value));

routes.get("/", (ctx) => {
  ctx.body = "healthy";
});

routes.get("/test", (ctx) => {
  console.log("manual", new Date().toUTCString());
  ctx.body = "manual";
});

new Koa<DefaultState, DefaultContext>()
  .use(bodyParser())
  .use(routes.routes())
  .use(routes.allowedMethods())
  .listen(4001, () => console.log(`listening at http://0.0.0.0:4001/`));
