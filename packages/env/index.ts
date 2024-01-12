import knexConfig, {
  KnexConfig,
} from "@to-bot/database/repositories/knex/knexfile";

import "dotenv/config";

// implement a checking to type safe environment loading

export type ApiEnvironment = {
  PORT: number;
  DATABASE_CONFIG: "development" | "production";
  DATABASE_URI: string;
};

export const loadApiEnvironment = async (): Promise<ApiEnvironment> => {
  const environment = {
    PORT: process.env.PORT as unknown as number,
    DATABASE_CONFIG: process.env.DATABASE_CONFIG as unknown as
      | "development"
      | "production",
    DATABASE_URI: process.env.DATABASE_URI as unknown as string
  };

  return environment;
};

export type DatabaseEnvironment = KnexConfig;

export const loadDatabaseEnvironment = async (
  config: "development" | "production"
): Promise<DatabaseEnvironment> => {
  const dbConfig = knexConfig[config];

  return dbConfig;
};
