import {
  CreateToReadDto,
  ToReadDto,
  ToReadRepository,
  UpdateToReadDto,
} from "../repositories/to-read/to-read.repository";

interface Controller {
  index(db: ToReadRepository): Promise<ToReadDto[]>;
  show(db: ToReadRepository, id: string): Promise<ToReadDto | undefined>;
  store(
    db: ToReadRepository,
    createToReadDto: CreateToReadDto
  ): Promise<ToReadDto>;
  update(
    db: ToReadRepository,
    updateToReadDto: UpdateToReadDto,
    id: string
  ): Promise<number>;
  delete(db: ToReadRepository, id: string): Promise<void>;
}
const controller: Controller = {
  index: async (repository) => repository.findAll(),

  show: async (repository, id) => repository.find(id),

  store: async (repository, createToReadDto) =>
    repository.create(createToReadDto),

  update: async (repository, { url, name }, id) =>
    repository.update({ url, name }, id),

  delete: async (repository, id) => repository.delete(id),
};

export default controller;
