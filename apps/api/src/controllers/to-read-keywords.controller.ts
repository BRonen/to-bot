import type {
  CreateToReadKeywordDto,
  ToReadKeywordDto,
  ToReadKeywordsRepository,
  UpdateToReadKeywordDto,
} from "@to-bot/database/repositories/to-read-keywords.repository";

interface Controller {
  index: (repository: ToReadKeywordsRepository) => Promise<ToReadKeywordDto[]>;
  show: (
    repository: ToReadKeywordsRepository,
    id: string
  ) => Promise<ToReadKeywordDto | undefined>;
  store: (
    repository: ToReadKeywordsRepository,
    createToReadDto: CreateToReadKeywordDto
  ) => Promise<ToReadKeywordDto>;
  update: (
    repository: ToReadKeywordsRepository,
    updateToReadDto: UpdateToReadKeywordDto,
    id: string
  ) => Promise<ToReadKeywordDto>;
  delete: (
    repository: ToReadKeywordsRepository,
    id: string
  ) => Promise<ToReadKeywordDto>;
}
const controller: Controller = {
  index: async (repository) => await repository.findAll(),
  show: async (repository, id) => await repository.find(id),
  store: async (repository, { tag }) => await repository.create({ tag }),
  update: async (repository, { tag }, id) =>
    await repository.update({ tag }, id),
  delete: async (repository, id) => await repository.delete(id),
};

export default controller;
