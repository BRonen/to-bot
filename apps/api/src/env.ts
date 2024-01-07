import "dotenv/config";

import knexConfig from "core/knexfile";

export type Environment = {
  PORT: number;
};

// implement a checking to type safe environment loading

export const environment: Environment = {
  PORT: process.env.PORT as any,
};

export const dbConfig = knexConfig["development"];
