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
