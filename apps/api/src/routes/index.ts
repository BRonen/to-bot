import Router from '@koa/router';
import fs from 'fs';

const router = new Router();

const routesFiles = fs.readdirSync(__dirname);
console.log('[#LOG]', `Found ${routesFiles.length - 1} routes files.`);

type RoutesImport = { default: Router }
routesFiles.forEach(async routesFile => {
    if (!routesFile.endsWith('.routes.ts')) return;

    console.log('[#LOG]', `Loading routes: "${routesFile}".`);

    try {        
        const { default: routesRouter } = await import(`./${routesFile}`) as RoutesImport;

        router
            .use(`/api`, routesRouter.routes())
            .use(`/api`, routesRouter.allowedMethods());
    } catch (e) {
        console.error(`[#ERROR] Unable to load routes from ${routesFile}: ${e}`);
    }
});

export default router;