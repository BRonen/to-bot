import type { Knex } from "knex";
import type { ToReadDto, ToReadRepository } from "./to-read.repository";

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

      console.log({ result });

      if (tags.length)
        await trx("to_read_keywords").insert(
          tags.map((tag) => ({ to_read_id: result.id, keyword_id: tag }))
        );

      return result;
    }),

  // todo: add a update function that updates tags relations too
  update: async (updateToReadDto, id) =>
    await db("to_read").update(updateToReadDto).where("id", id),

  // todo: add a delete function that deletes the to read item from the database and its relations
  delete: async (_id) => {},
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
