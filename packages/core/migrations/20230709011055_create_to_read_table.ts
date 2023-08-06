import { Knex } from "knex";

type KnexMigration = (knex: Knex) => Promise<void>;

export const up: KnexMigration = async (knex) =>
  knex.schema
    .createTable("to_read", (table) => {
      table.increments("id");
      table.string("discord_id", 255).notNullable().unique();
      table.string("url", 255).notNullable().unique();
      table.string("name", 255);
      table.boolean("readed").notNullable().defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable("to_read_keywords", (table) => {
      table.timestamps(true, true);

      table.integer("to_read_id").index().references("id").inTable("to_read");

      table.integer("keyword_id").index().references("id").inTable("keywords");
    })
    .createTable("keywords", (table) => {
      table.timestamps(true, true);
      table.increments("id");
      table.string("tag", 255).notNullable();
    });

export const down: KnexMigration = (knex) =>
  knex.schema
    .dropTableIfExists("to_read_keywords")
    .dropTableIfExists("to_read")
    .dropTableIfExists("keywords");
