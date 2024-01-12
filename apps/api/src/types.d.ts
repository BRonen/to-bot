import { Knex } from "knex";

export type { Database } from "@to-bot/database";

export type AppContext = { database: Database, db: Knex };
