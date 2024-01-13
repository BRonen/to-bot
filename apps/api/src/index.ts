import routes from "./routes";
import { loadApiEnvironment } from "@to-bot/env";
import { createApp } from "./app";
import { createConnection } from "@to-bot/database";

(async () => {
  const env = await loadApiEnvironment();

  const database = createConnection(env.DATABASE_URI);

  createApp(routes, database, env).listen(env.PORT, () =>
    console.log(`listening at http://0.0.0.0:${env.PORT}/`)
  );
})();
