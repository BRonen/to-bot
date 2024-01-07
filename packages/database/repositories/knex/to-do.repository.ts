import type { Knex } from "knex";

export type ToReadSearchFilters = {
  limit: number;
  offset: number;
  order_by: string;
};

export type ToReadDto = {
  id: number;
  created_at: number;
  updated_at: number;
};

export type CreateToReadDto = any;

export type UpdateToReadDto = any;

export type ToReadRepository = {
  find: (id: string) => Promise<ToReadDto | undefined>;
  findAll: (filters: ToReadSearchFilters) => Promise<ToReadDto[]>;
  create: (createToReadDto: CreateToReadDto) => Promise<ToReadDto>;
  update: (updateToReadDto: UpdateToReadDto, id: string) => Promise<number>;
  delete: (id: string) => Promise<void>;
};

const createRepository = (db: Knex): ToReadRepository => ({
  find: async (toReadId) => {
    const results = await db.raw(
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

    return results;
  },

  findAll: async (params) => {
    // TODO: remove duplicated code
    const query = params
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

    const results = await db.raw(query, params);

    return results;
  },

  create: async (createToReadDto) =>
    await db.transaction(async (trx) => {
      const [result] = await trx("to_read").insert(createToReadDto, "id");

      return result;
    }),

  // TODO: add returning to see the result of update and delete
  // TODO: add a update function that updates tags relations too
  update: async (updateToReadDto, id) =>
    await db("to_read").update(updateToReadDto).where("id", id),

  delete: async (id) => {
    await db("to_read").where("id", id).delete();
  },
});

export default createRepository;
