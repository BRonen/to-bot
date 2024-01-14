import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* To-Read Module */

export const toReadSchema = pgTable("to_read", {
  id: serial("id").primaryKey(),
  discordId: varchar("discord_id", { length: 256 }).notNull().unique(),
  url: varchar("url", { length: 256 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  readed: boolean("readed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const toReadRelations = relations(toReadSchema, ({ many }) => ({
  toReadsToKeywords: many(toReadsToKeywordsSchema),
}));

export const toReadKeywordSchema = pgTable("to_read_keyword", {
  id: serial("id").primaryKey(),
  tag: varchar("tag", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const toReadKeywordRelations = relations(
  toReadKeywordSchema,
  ({ many }) => ({
    toReadsToKeywords: many(toReadsToKeywordsSchema),
  })
);

export const toReadsToKeywordsSchema = pgTable(
  "to_reads_to_keywords",
  {
    toReadId: integer("to_read_id")
      .notNull()
      .references(() => toReadSchema.id),
    toReadKeywordId: integer("to_read_keywords_id")
      .notNull()
      .references(() => toReadKeywordSchema.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.toReadId, t.toReadKeywordId] }),
  })
);

export const usersToGroupsRelations = relations(
  toReadsToKeywordsSchema,
  ({ one }) => ({
    group: one(toReadKeywordSchema, {
      fields: [toReadsToKeywordsSchema.toReadKeywordId],
      references: [toReadKeywordSchema.id],
    }),
    user: one(toReadSchema, {
      fields: [toReadsToKeywordsSchema.toReadId],
      references: [toReadSchema.id],
    }),
  })
);

/* To-do Module */

// TODO: add categories to To-do schema
// TODO: add a parent to-do relation nullable
// TODO: add a text description (maybe a markdown file)
// TODO: think about adding initial date and end date instead of just a date

export const toDoSchema = pgTable("to_do", {
  id: serial("id").primaryKey(),
  name: varchar("tag", { length: 128 }).notNull().unique(),
  archived: boolean("archived").default(false).notNull(),
  status: integer("status").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const toDoCronRuleSchema = pgTable(
  "to_do_cron_rule",
  {
    id: integer("id")
      .notNull()
      .references(() => toDoSchema.id),
    cron: varchar("tag", { length: 32 }).notNull(),
    disabled: boolean("disabled").default(false).notNull(),
    runnedAt: timestamp("runned_at"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.id] }),
  }),
);
