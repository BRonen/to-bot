import { z } from "zod";

import "dotenv/config";

const apiEnvironmentSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URI: z.string(),
});

export const loadApiEnvironment = async (): Promise<
  z.infer<typeof apiEnvironmentSchema>
> => {
  const environment = {
    PORT: process.env.PORT,
    DATABASE_URI: process.env.DATABASE_URI,
  };

  const env = apiEnvironmentSchema.safeParse(environment);

  if (!env.success) {
    console.log("Error while loading environment");
    throw env.error;
  }

  return env.data;
};

const schedulerEnvironmentSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URI: z.string(),
});

export const loadSchedulerEnvironment = async (): Promise<
  z.infer<typeof schedulerEnvironmentSchema>
> => {
  const environment = {
    DATABASE_URI: process.env.DATABASE_URI,
    PORT: process.env.PORT,
  };

  const env = schedulerEnvironmentSchema.safeParse(environment);

  if (!env.success) {
    console.log("Error while loading environment");
    throw env.error;
  }

  return env.data;
};

const databaseEnvironmentSchema = z.object({
  DATABASE_URI: z.string(),
});

export const loadDatabaseEnvironment = async (): Promise<
  z.infer<typeof databaseEnvironmentSchema>
> => {
  const environment = {
    DATABASE_URI: process.env.DATABASE_URI,
  };

  const env = databaseEnvironmentSchema.safeParse(environment);

  if (!env.success) {
    console.log("Error while loading environment");
    throw env.error;
  }

  return env.data;
};
