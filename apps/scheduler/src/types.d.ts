export type { Database } from "@to-bot/database";
import cron from 'node-cron'

export type Cron = typeof cron;

export type AppContext = { cron: Cron, database: Database };
