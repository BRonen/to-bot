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
