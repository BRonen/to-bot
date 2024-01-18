import { eq, sql } from "drizzle-orm";
import type { Database } from "../";
import { toReadKeywordSchema } from "../schemas";

export type ToReadKeywordDto = {
  id: number;
  tag: string;
  created_at: number;
  updated_at: number;
};

export type CreateToReadKeywordDto = {
  tag: string;
};

export type UpdateToReadKeywordDto = {
  tag: string;
};

export type ToReadKeywordsRepository = {
  find: (id: string) => Promise<ToReadKeywordDto | undefined>;
  findAll: () => Promise<{ results: ToReadKeywordDto[]; total: number }>;
  create: (
    createToReadKeywordDto: CreateToReadKeywordDto
  ) => Promise<ToReadKeywordDto>;
  update: (
    updateToReadKeywordDto: UpdateToReadKeywordDto,
    id: string
  ) => Promise<ToReadKeywordDto>;
  delete: (id: string) => Promise<ToReadKeywordDto>;
};

const createRepository = (db: Database): ToReadKeywordsRepository => ({
  find: async (keywordId) => {
    const [result] = await db
      .select()
      .from(toReadKeywordSchema)
      .where(eq(toReadKeywordSchema.id, Number(keywordId)));

    return {
      id: result.id,
      tag: result.tag,
      created_at: result.createdAt.getTime(),
      updated_at: result.updatedAt.getTime(),
    };
  },

  findAll: async () => {
    const results = await db
      .select({
        to_read_keyword: toReadKeywordSchema,
        total: sql<number>`count(*) over ()`,
      })
      .from(toReadKeywordSchema);

    return {
      results: results.map((result) => ({
        id: result.to_read_keyword.id,
        tag: result.to_read_keyword.tag,
        created_at: result.to_read_keyword.createdAt.getTime(),
        updated_at: result.to_read_keyword.updatedAt.getTime(),
      })),
      total: results[0]?.total || 0,
    };
  },

  create: async (createToReadKeywordDto) => {
    const [result] = await db
      .insert(toReadKeywordSchema)
      .values(createToReadKeywordDto)
      .returning();

    return {
      id: result.id,
      tag: result.tag,
      created_at: result.createdAt.getTime(),
      updated_at: result.updatedAt.getTime(),
    };
  },

  update: async (updateToReadKeywordDto, id) => {
    const [result] = await db
      .update(toReadKeywordSchema)
      .set(updateToReadKeywordDto)
      .where(eq(toReadKeywordSchema.id, Number(id)))
      .returning();

    return {
      id: result.id,
      tag: result.tag,
      created_at: result.createdAt.getTime(),
      updated_at: result.updatedAt.getTime(),
    };
  },

  delete: async (id) => {
    const [result] = await db
      .delete(toReadKeywordSchema)
      .where(eq(toReadKeywordSchema.id, Number(id)))
      .returning();

    return {
      id: result.id,
      tag: result.tag,
      created_at: result.createdAt.getTime(),
      updated_at: result.updatedAt.getTime(),
    };
  },
});

export default createRepository;
