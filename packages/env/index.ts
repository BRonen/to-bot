import "dotenv/config";

import knexConfig, { KnexConfig } from "database/repositories/knex/knexfile";

// implement a checking to type safe environment loading

export type ApiEnvironment = {
  PORT: number;
  DATABASE_CONFIG: "development" | "production";
};

export const loadApiEnvironment = (): ApiEnvironment => {
  const environment = {
    PORT: process.env.PORT as any,
    DATABASE_CONFIG: process.env.DATABASE_CONFIG as any,
  };

  return environment;
};

export type DatabaseEnvironment = KnexConfig;

export const loadDatabaseEnvironment = (
  config: "development" | "production"
): DatabaseEnvironment => {
  const dbConfig = knexConfig[config];

  return dbConfig;
};
