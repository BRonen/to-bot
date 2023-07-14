import type {
  CreateToReadKeywordDto,
  ToReadKeywordDto,
  ToReadKeywordsRepository,
  UpdateToReadKeywordDto,
} from "core/repositories/to-read-keywords/to-read-keywords.repository";

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
  ) => Promise<number>;
}
const controller: Controller = {
  index: async (repository) => await repository.findAll(),
  show: async (repository, id) => await repository.find(id),
  store: async (repository, { tag }) => await repository.create({ tag }),
  update: async (repository, { tag }, id) =>
    await repository.update({ tag }, id),
};

export default controller;
