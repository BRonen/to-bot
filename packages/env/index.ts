import "dotenv/config";

import knexConfig, {
  KnexConfig,
} from "@to-bot/database/repositories/knex/knexfile";

// implement a checking to type safe environment loading

export type ApiEnvironment = {
  PORT: number;
  DATABASE_CONFIG: "development" | "production";
};

export const loadApiEnvironment = (): ApiEnvironment => {
  const environment = {
    PORT: process.env.PORT as unknown as number,
    DATABASE_CONFIG: process.env.DATABASE_CONFIG as unknown as "development" | "production",
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
