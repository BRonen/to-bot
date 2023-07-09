import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: process.env.API_DATABASE,
      user: process.env.API_DATABASE_USER,
      password: process.env.API_DATABASE_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default config;