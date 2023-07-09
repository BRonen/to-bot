import { Knex } from 'knex';

type KnexMigration = (knex: Knex) => Promise<void>;

export const up: KnexMigration = async knex =>
  knex.schema
    .createTable('to_read', table => {
      table.increments('id').notNullable().unique().primary();
      table.string('url', 255).notNullable().unique();
      table.string('name', 255);
      table.boolean('readed').notNullable().defaultTo(false);
      table.timestamps(true, true);
    });

export const down: KnexMigration = knex =>
  knex.schema
    .dropTable('to_read');

