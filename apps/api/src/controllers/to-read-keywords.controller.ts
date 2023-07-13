import { Knex } from 'knex';

interface ToReadKeywordDto {
  tag: string;
  created_at: number;
  updated_at: number;
}

interface CreateToReadKeywordDto {
  tag: string;
}

interface UpdateToReadKeywordDto {
  tag: string;
}

type Controller = {
  index: (db: Knex) => Promise<ToReadKeywordDto[]>;
  create: (
    db: Knex,
    createToReadDto: CreateToReadKeywordDto
  ) => Promise<ToReadKeywordDto>;
  update: (
    db: Knex,
    updateToReadDto: UpdateToReadKeywordDto,
    id: string
  ) => Promise<number>;
};
const controller: Controller = {
  index: async (db) => await db('keywords').select('*'),
  create: async (db, { tag }) => await db('keywords').insert({ tag }),
  update: async (db, { tag }, id) =>
    await db('keywords').update({ tag }).where('id', id),
};

export default controller;
