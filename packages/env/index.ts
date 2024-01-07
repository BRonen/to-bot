import "dotenv/config";

import knexConfig from "database/knexfile";

// implement a checking to type safe environment loading

export type ApiEnvironment = {
  PORT: number;
};

export const loadApiEnvironment = (): ApiEnvironment => {
  const environment = {
    PORT: process.env.PORT as any,
  };

  return environment;
};

export type DatabaseEnvironment = (typeof knexConfig)["development"];

export const loadDatabaseEnvironment = (): DatabaseEnvironment => {
  const dbConfig = knexConfig["development"];

  return dbConfig;
};
