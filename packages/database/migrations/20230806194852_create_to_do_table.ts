import type { Knex } from "knex";

type KnexMigration = (knex: Knex) => Promise<void>;

export const up: KnexMigration = async (knex) =>
  knex.schema.createTable("to_do", (table) => {
    table.increments("id");
    table.timestamps(true, true);
  });

export const down: KnexMigration = (knex) =>
  knex.schema.dropTableIfExists("to_do");
