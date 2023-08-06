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
};
