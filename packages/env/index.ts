import knexConfig, {
  KnexConfig,
} from "@to-bot/database/repositories/knex/knexfile";

// implement a checking to type safe environment loading

export type ApiEnvironment = {
  PORT: number;
  DATABASE_CONFIG: "development" | "production";
};

export const loadApiEnvironment = async (): Promise<ApiEnvironment> => {
  if(!process.env.PORT)
    await import("dotenv/config");

  const environment = {
    PORT: process.env.PORT as unknown as number,
    DATABASE_CONFIG: process.env.DATABASE_CONFIG as unknown as "development" | "production",
  };

  return environment;
};

export type DatabaseEnvironment = KnexConfig;

export const loadDatabaseEnvironment = async (
  config: "development" | "production"
): Promise<DatabaseEnvironment> => {
  if(!process.env.PORT)
    await import("dotenv/config");

  const dbConfig = knexConfig[config];

  return dbConfig;
};
