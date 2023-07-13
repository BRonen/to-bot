import { Knex } from "knex";

export type ToReadDto = {
  id: number;
  url: string;
  name?: string;
  tags?: string[];
  created_at: number;
  updated_at: number;
};

export type CreateToReadDto = {
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
  findAll: () => Promise<ToReadDto[]>;
  create: (createToReadDto: CreateToReadDto) => Promise<ToReadDto>;
  update: (updateToReadDto: UpdateToReadDto, id: string) => Promise<number>;
  delete: (id: string) => Promise<void>;
};