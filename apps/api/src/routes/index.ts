import type { DefaultState } from "koa";
import Router from "@koa/router";
import fs from "fs";

import { AppContext } from "../types";

const router = new Router({ prefix: "/api" });

const routesFiles = fs.readdirSync(__dirname);

console.log(`Found ${routesFiles.length - 1} routes files.`);

type DynamicRoute = { default: Router<DefaultState, AppContext> };

routesFiles.forEach(async (routesFile) => {
  if (!routesFile.endsWith(".routes.ts")) return;

  console.log(`Loading routes: "${routesFile}".`);

  try {
    const { default: routesRouter } = (await import(
      `./${routesFile}`
    )) satisfies DynamicRoute;

    router.use(routesRouter.routes()).use(routesRouter.allowedMethods());
  } catch (e) {
    console.error(`[#ERROR] Unable to load routes from ${routesFile}: ${e}`);
  }
});

export default router;
