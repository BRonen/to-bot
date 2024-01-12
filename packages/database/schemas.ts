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
