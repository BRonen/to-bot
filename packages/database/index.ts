import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schemas';

export type Database = PostgresJsDatabase<Record<string, never>>;

export const createClient = (uri: string) => {
    return postgres(uri, { max: 1 });
};

export const createConnection = (uri: string) => {
    const client = createClient(uri);

    return drizzle(client, { schema });
};
