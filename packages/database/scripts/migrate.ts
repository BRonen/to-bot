import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';

import { loadDatabaseEnvironment } from "@to-bot/env";
import { createConnection } from '../index';

(async () => {
    const env = await loadDatabaseEnvironment();
    
    const database = createConnection(env.DATABASE_URI);
    
    migrate(database, { migrationsFolder: path.join(__dirname, '../migrations/') });
})()