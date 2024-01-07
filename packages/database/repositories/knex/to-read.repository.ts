import type { Knex } from "knex";

export type ToReadSearchFilters = {
  limit: number;
  offset: number;
  order_by: string;
  tags?: string;
};

export type ToReadDto = {
  id: number;
  discord_id: string;
  url: string;
  name?: string;
  readed: boolean;
  tags?: string[];
  created_at: number;
  updated_at: number;
};

export type CreateToReadDto = {
  discord_id: string;
  url: string;
  tags: number[];
  name?: string;
};

export type UpdateToReadDto = {
  url?: string;
  name?: string;
  readed?: string;
};

export type ToReadRepository = {
  find: (id: string) => Promise<ToReadDto | undefined>;
  findAll: (filters: ToReadSearchFilters) => Promise<ToReadDto[]>;
  create: (createToReadDto: CreateToReadDto) => Promise<ToReadDto>;
  update: (updateToReadDto: UpdateToReadDto, id: string) => Promise<number>;
  delete: (id: string) => Promise<void>;
  addKeywordsByIds: (keywords: number[], id: number) => Promise<number>;
  clearKeywordsById: (id: number) => Promise<void>;
  deleteByDiscordId: (discordId: string) => Promise<void>;
  setAsReadedByDiscordId: (discordId: string) => Promise<void>;
};

interface ToReadRawResult {
  id: number;
  discord_id: string;
  url: string;
  name?: string;
  readed: boolean;
  tag?: string;
  created_at: number;
  updated_at: number;
}

const parseToReadTags = (toReads: ToReadRawResult[]): ToReadDto | undefined => {
  let result: ToReadDto | undefined;

  for (const toRead of toReads)
    if (!result || !toRead.tag) {
      const { id, discord_id, url, name, readed, created_at, updated_at } =
        toRead;

      result = {
        id,
        discord_id,
        url,
        name,
        readed,
        tags: [],
        created_at,
        updated_at,
      };

      if (toRead.tag) result.tags = [toRead.tag];
    } else {
      result.tags?.push(toRead.tag);
    }

  return result;
};

const parseToReadsTags = (toReads: ToReadRawResult[]): ToReadDto[] => {
  const results: Record<string, ToReadDto> = {};

  for (const toRead of toReads)
    if (results[toRead.id] && toRead.tag) {
      results[toRead.id].tags?.push(toRead.tag);
    } else {
      const { id, discord_id, url, name, readed, created_at, updated_at } =
        toRead;

      results[id] = {
        id,
        discord_id,
        url,
        name,
        readed,
        tags: [],
        created_at,
        updated_at,
      };

      if (toRead.tag) results[toRead.id].tags = [toRead.tag];
    }

  return Object.values(results);
};

const createRepository = (db: Knex): ToReadRepository => ({
  find: async (toReadId) => {
    const results = await db.raw<ToReadRawResult[]>(
      `
            select tr.id, tr.discord_id, tr.url, tr.name, tr.readed, k.tag, tr.created_at, tr.updated_at
            from to_read as tr
            left join keywords as k
            on k.id in
                (select keyword_id from to_read_keywords as trk where tr.id = trk.to_read_id)
            and tr.id in
                (select to_read_id from to_read_keywords as trk)
            where tr.id = :to_read_id
        `,
      {
        to_read_id: toReadId,
      }
    );

    return parseToReadTags(results);
  },

  findAll: async (params) => {
    // TODO: remove duplicated code
    const query = params.tags
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
    `;

    const results = await db.raw<ToReadRawResult[]>(query, params);

    return parseToReadsTags(results);
  },

  create: async ({ tags, ...createToReadDto }) =>
    await db.transaction(async (trx) => {
      const [result] = await trx("to_read").insert(createToReadDto, "id");

      if (tags.length)
        await trx("to_read_keywords").insert(
          tags.map((tag) => ({ to_read_id: result.id, keyword_id: tag }))
        );

      return result;
    }),

  // TODO: add returning to see the result of update and delete
  // TODO: add a update function that updates tags relations too
  update: async (updateToReadDto, id) =>
    await db("to_read").update(updateToReadDto).where("id", id),

  delete: async (id) => {
    await db("to_read").where("id", id).delete();
  },
  addKeywordsByIds: async (keywords, id) =>
    await db("to_read_keywords").insert(
      keywords.map((keyword) => ({ to_read_id: id, keyword_id: keyword }))
    ),
  clearKeywordsById: async (id) =>
    await db("to_read_keywords").where("to_read_id", id).delete(),
  deleteByDiscordId: async (discordId) =>
    await db("to_read").where("discord_id", discordId).delete(),
  setAsReadedByDiscordId: async (discordId) => {
    await db("to_read").update({ readed: true }).where("discord_id", discordId);
  },
});

export default createRepository;
