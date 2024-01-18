import {
  PostgresJsDatabase,
  PostgresJsTransaction,
  drizzle,
} from "drizzle-orm/postgres-js";
import { ExtractTablesWithRelations } from "drizzle-orm";
import postgres from "postgres";

import * as schema from "./schemas";

export type Database = PostgresJsDatabase<typeof schema>;
export type Transaction = PostgresJsTransaction<
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export const createClient = (uri: string) => {
  return postgres(uri, { max: 1 });
};

export const createConnection = (uri: string) => {
  const client = createClient(uri);

  return drizzle(client, { logger: true, schema });
};
