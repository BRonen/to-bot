import type {
  CreateToReadDto,
  ToReadDto,
  ToReadRepository,
  UpdateToReadDto,
} from "@to-bot/database/repositories/to-read.repository";

type ToReadFilters = {
  page: string | string[] | undefined;
  per_page: string | string[] | undefined;
  order_by: string | string[] | undefined;
  tags: string | string[] | undefined;
};

interface Controller {
  index(db: ToReadRepository, filters: ToReadFilters): Promise<ToReadDto[]>;
  show(db: ToReadRepository, id: string): Promise<ToReadDto | undefined>;
  store(
    db: ToReadRepository,
    createToReadDto: CreateToReadDto
  ): Promise<ToReadDto>;
  update(
    db: ToReadRepository,
    updateToReadDto: UpdateToReadDto,
    id: string
  ): Promise<ToReadDto>;
  delete(db: ToReadRepository, id: string): Promise<ToReadDto>;
}
const controller: Controller = {
  // TODO: refactor the parsing of query parameters and default values
  index: async (repository, { order_by, page, per_page, tags }) =>
    repository.findAll({
      offset: page ? Number(per_page) * (Number(page) - 1) : 0,
      limit: per_page ? Number(per_page) : 15,
      tags: tags ? String(tags) : undefined,
      order_by: String(order_by) || "id",
    }),

  show: async (repository, id) => repository.find(id),

  store: async (repository, { discord_id, url, name, tags }) =>
    repository.create({ discord_id, url, name, tags }),

  update: async (repository, { url, name }, id) =>
    repository.update({ url, name }, id),

  delete: async (repository, id) => repository.delete(id),
};

export default controller;
