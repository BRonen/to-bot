import { eq, sql } from "drizzle-orm";

import type { Database } from "../";
import {
  toReadKeywordSchema,
  toReadSchema,
  toReadsToKeywordsSchema,
} from "../schemas";

export type ToReadSearchFilters = {
  limit: number;
  offset: number;
  order_by: string;
  tags?: string;
};

export type ToReadDto = {
  id: number;
  discord_id: string | null;
  url: string;
  name?: string;
  readed: boolean;
  tags?: string[];
  created_at: number;
  updated_at: number;
};

export type CreateToReadDto = {
  discord_id: string | null;
  url: string;
  tags: number[];
  name: string;
};

export type UpdateToReadDto = {
  url?: string;
  name?: string;
  readed?: boolean;
};

export type ToReadRepository = {
  find: (id: string) => Promise<ToReadDto | undefined>;
  findAll: (
    filters: ToReadSearchFilters
  ) => Promise<{ results: ToReadDto[]; total: number }>;
  create: (createToReadDto: CreateToReadDto) => Promise<ToReadDto>;
  update: (updateToReadDto: UpdateToReadDto, id: string) => Promise<ToReadDto>;
  delete: (id: string) => Promise<ToReadDto>;
  addKeywordsByIds: (keywords: number[], id: number) => Promise<ToReadDto>;
  clearKeywordsById: (id: number) => Promise<void>;
  deleteByDiscordId: (discordId: string) => Promise<ToReadDto>;
  setAsReadedByDiscordId: (discordId: string) => Promise<ToReadDto>;
};

const createRepository = (db: Database): ToReadRepository => ({
  find: async (toReadId) => {
    const [result] = await db
      .select({
        id: toReadSchema.id,
        name: toReadSchema.name,
        url: toReadSchema.url,
        discord_id: toReadSchema.discordId,
        readed: toReadSchema.readed,
        created_at: toReadSchema.createdAt,
        updated_at: toReadSchema.updatedAt,
      })
      .from(toReadSchema)
      .where(eq(toReadSchema.id, Number(toReadId)))
      .limit(1);

    return {
      ...result,
      tags: [],
      created_at: result.created_at.getTime(),
      updated_at: result.updated_at.getTime(),
    };
  },

  findAll: async (params) => {
    /* const query = params.tags
      ? `
      select tr.id, tr.discord_id, tr.url, tr.name, tr.name, tr.readed, k.tag, tr.created_at, tr.updated_at
      from to_read as tr
      left join keywords as k
      on k.id in
        (select keyword_id from to_read_keywords as trk where tr.id = trk.to_read_id)
      and tr.id in
        (select to_read_id from to_read_keywords as trk)
      where
        k.tag in (:tags)
      order by :order_by
      limit :limit
      offset :offset
    `
      : `
      select tr.id, tr.discord_id, tr.url, tr.name, tr.name, tr.readed, k.tag, tr.created_at, tr.updated_at
      from to_read as tr
      left join keywords as k
      on k.id in
        (select keyword_id from to_read_keywords as trk where tr.id = trk.to_read_id)
      and tr.id in
        (select to_read_id from to_read_keywords as trk)
      order by :order_by
      limit :limit
      offset :offset
    `; */
    // TODO: implement query params like offset, limit and order

    const results = await db
      .select({
        to_reads_to_keywords: toReadsToKeywordsSchema,
        to_read: toReadSchema,
        to_read_keyword: toReadKeywordSchema,
        total: sql<number>`count(*) over ()`,
      })
      .from(toReadSchema)
      .leftJoin(
        toReadsToKeywordsSchema,
        eq(toReadsToKeywordsSchema.toReadId, toReadSchema.id)
      )
      .leftJoin(
        toReadKeywordSchema,
        eq(toReadsToKeywordsSchema.toReadKeywordId, toReadKeywordSchema.id)
      )
      .limit(10);

    console.table(results);

    const indexedResults = results.reduce((acc, result) => {
      console.table(result);

      if (!result.to_read) return {};

      const currentId = result.to_read.id;
      const currentResult = acc[currentId];
      const currentTag = result.to_read_keyword;

      if (currentResult)
        return {
          ...acc,
          [currentId]: {
            ...currentResult,
            tags: [...(currentResult.tags || []), currentTag?.tag],
          },
        };

      return {
        ...acc,
        [currentId]: {
          id: result.to_read.id,
          discord_id: result.to_read.discordId,
          url: result.to_read.url,
          name: result.to_read.name,
          readed: result.to_read.readed,
          tags: [ currentTag?.tag ],
          created_at: result.to_read.createdAt,
          updated_at: result.to_read.updatedAt,
        },
      };
    }, {} as Record<string, ToReadDto>);

    console.table(indexedResults);

    return {
      results: Object.values(indexedResults),
      total: results[0]?.total || 0,
    };
  },

  create: async ({ tags, ...createToReadDto }) =>
    await db.transaction(async (trx) => {
      const [result] = await trx
        .insert(toReadSchema)
        .values({
          name: createToReadDto.name,
          discordId: createToReadDto.discord_id,
          url: createToReadDto.url,
        })
        .returning();

      if (tags.length)
        await trx
          .insert(toReadsToKeywordsSchema)
          .values(
            tags.map((tag) => ({ toReadId: result.id, toReadKeywordId: tag }))
          );

      return {
        id: result.id,
        discord_id: result.discordId,
        url: result.url,
        name: result.name,
        readed: result.readed,
        updated_at: result.updatedAt.getTime(),
        created_at: result.createdAt.getTime(),
      };
    }),

  // TODO: add a update function that updates tags relations too
  update: async (updateToReadDto, id) => {
    const [result] = await db
      .update(toReadSchema)
      .set({
        ...updateToReadDto,
        readed: updateToReadDto.readed,
        updatedAt: new Date(),
      })
      .where(eq(toReadSchema.id, Number(id)))
      .returning();

    return {
      ...result,
      tags: [],
      discord_id: result.discordId,
      created_at: result.createdAt.getTime(),
      updated_at: result.updatedAt.getTime(),
    };
  },

  delete: async (id) => {
    const [result] = await db
      .delete(toReadSchema)
      .where(eq(toReadSchema.id, Number(id)))
      .returning();

    return {
      ...result,
      tags: [],
      discord_id: result.discordId,
      created_at: result.createdAt.getTime(),
      updated_at: result.updatedAt.getTime(),
    };
  },

  addKeywordsByIds: async (keywords, id) => {
    const [[result], tags] = await Promise.all([
      db
        .insert(toReadsToKeywordsSchema)
        .values(
          keywords.map((keyword) => ({
            toReadId: id,
            toReadKeywordId: keyword,
          }))
        )
        .returning({
          id: toReadSchema.id,
          name: toReadSchema.name,
          url: toReadSchema.url,
          discord_id: toReadSchema.discordId,
          readed: toReadSchema.readed,
          created_at: toReadSchema.createdAt,
          updated_at: toReadSchema.updatedAt,
        }),
      db
        .select({
          tag: toReadKeywordSchema.tag,
        })
        .from(toReadsToKeywordsSchema)
        .where(eq(toReadsToKeywordsSchema.toReadId, id))
        .leftJoin(
          toReadKeywordSchema,
          eq(toReadKeywordSchema.id, toReadsToKeywordsSchema.toReadKeywordId)
        ),
    ]);

    return {
      ...result,
      created_at: result.created_at.getTime(),
      updated_at: result.updated_at.getTime(),
      tags: tags.map(({ tag }) => tag as string),
    };
  },

  clearKeywordsById: async (id) => {
    await db
      .delete(toReadsToKeywordsSchema)
      .where(eq(toReadsToKeywordsSchema.toReadId, id));
  },

  deleteByDiscordId: async (discordId) => {
    const [result] = await db
      .delete(toReadSchema)
      .where(eq(toReadSchema.discordId, discordId))
      .returning();

    return {
      ...result,
      tags: [],
      discord_id: result.discordId,
      created_at: result.createdAt.getTime(),
      updated_at: Date.now(),
    };
  },
  setAsReadedByDiscordId: async (discordId) => {
    const [result] = await db
      .update(toReadSchema)
      .set({ readed: true })
      .where(eq(toReadSchema.discordId, discordId))
      .returning();

    return {
      ...result,
      tags: [],
      discord_id: result.discordId,
      created_at: result.createdAt.getTime(),
      updated_at: Date.now(),
    };
  },
});

export default createRepository;
