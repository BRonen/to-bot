import { Knex } from 'knex';

const parseToReadsTags = (toReads: ToReadRawResult[]): ToReadDto[] => {
  const results: Record<string, ToReadDto> = {};

  for (const toRead of toReads)
    if (results[toRead.id] && toRead.tag) {
      results[toRead.id].tags.push(toRead.tag);
    } else {
      const { id, url, name, created_at, updated_at } = toRead;

      results[id] = {
        id,
        url,
        name,
        tags: [],
        created_at,
        updated_at,
      };

      if (toRead.tag) results[toRead.id].tags = [toRead.tag];
    }

  return Object.values(results);
};

interface ToReadRawResult {
  id: number;
  url: string;
  name?: string;
  tag?: string;
  created_at: number;
  updated_at: number;
}

interface ToReadDto extends Omit<ToReadRawResult, 'tag'> {
  tags: string[];
}

interface CreateToReadDto {
  url: string;
  tags: number[];
  name?: string;
}

interface UpdateToReadDto {
  url?: string;
  name?: string;
  readed?: string;
}

type Controller = {
  index: (db: Knex) => Promise<ToReadDto[]>;
  create: (db: Knex, createToReadDto: CreateToReadDto) => Promise<ToReadDto>;
  update: (
    db: Knex,
    updateToReadDto: UpdateToReadDto,
    url: string
  ) => Promise<number>;
};
const controller: Controller = {
  index: async (db) => {
    const results = await db.raw<ToReadRawResult[]>(`
            select tr.id, tr.url, tr.name, tr.name, k.tag, tr.created_at, tr.created_at
            from to_read as tr
            left join keywords as k
            on k.id in
                (select keyword_id from to_read_keywords as trk where tr.id = trk.to_read_id)
            and tr.id in
                (select to_read_id from to_read_keywords as trk)
        `);

    return parseToReadsTags(results);
  },
  create: async (db, { tags, ...createToReadDto }) =>
    await db.transaction(async (trx) => {
      const [result] = await trx('to_read').insert(createToReadDto, 'id');

      await trx('to_read_keywords').insert(
        tags.map((tag) => ({ to_read_id: result.id, keyword_id: tag }))
      );

      return result;
    }),
  // todo: add a update function that updates tags relations too
  update: async (db, updateToReadDto, url) =>
    await db('to_read').update(updateToReadDto).where('url', url),
};

export default controller;
