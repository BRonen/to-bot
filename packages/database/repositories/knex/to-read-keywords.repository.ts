import type { Knex } from "knex";

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
  findAll: () => Promise<ToReadKeywordDto[]>;
  create: (
    createToReadDto: CreateToReadKeywordDto
  ) => Promise<ToReadKeywordDto>;
  update: (
    updateToReadDto: UpdateToReadKeywordDto,
    id: string
  ) => Promise<number>;
  delete: (id: string) => Promise<void>;
};

const createRepository = (db: Knex): ToReadKeywordsRepository => ({
  find: async (keywordId) =>
    await db.raw<ToReadKeywordDto | undefined>(
      "select k.id, k.tag, k.created_at, k.updated_at from keywords as k where id = :keyword_id",
      {
        keyword_id: keywordId,
      }
    ),

  findAll: async () =>
    await db.raw<ToReadKeywordDto[]>(
      "select k.id, k.tag, k.created_at, k.updated_at from keywords as k"
    ),

  create: async (createToReadKeywordDto) =>
    await db("keywords").insert(createToReadKeywordDto, "id"),

  update: async (updateToReadDto, id) =>
    await db("keywords").update(updateToReadDto).where("id", id),

  delete: async (id) => {
    await db("keywords").where("id", id).delete();
  },
});

export default createRepository;
