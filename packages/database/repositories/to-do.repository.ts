import { eq } from "drizzle-orm";
import type { Database, Transaction } from "../";
import { toDoSchema } from "../schemas";

export type ToDoDto = {
  id: number;
  name: string;
  archived: boolean;
  status: number | null;
  created_at: number;
  updated_at: number;
};

export type CreateToDoDto = {
  name: string;
};

export type UpdateToDoDto = {
  name: string;
};

export type ToDoRepository = {
  find: (id: string) => Promise<ToDoDto | undefined>;
  findAll: () => Promise<ToDoDto[]>;
  create: (createToDoDto: CreateToDoDto) => Promise<ToDoDto>;
  update: (updateToDoDto: UpdateToDoDto, id: string) => Promise<ToDoDto>;
  delete: (id: string) => Promise<ToDoDto>;
  transaction: <T>(callback: (trx: Transaction) => Promise<T>) => Promise<T>;
};

const createRepository = (db: Database): ToDoRepository => ({
  find: async (id) => {
    const [result] = await db
      .select()
      .from(toDoSchema)
      .where(eq(toDoSchema.id, Number(id)));

    return {
      id: result.id,
      name: result.name,
      archived: result.archived,
      status: result.status,
      created_at: result.createdAt.getTime(),
      updated_at: result.updatedAt.getTime(),
    };
  },

  findAll: async () => {
    const results = await db.select().from(toDoSchema);

    return results.map((result) => ({
      id: result.id,
      name: result.name,
      archived: result.archived,
      status: result.status,
      created_at: result.createdAt.getTime(),
      updated_at: result.updatedAt.getTime(),
    }));
  },

  create: async (createToDoDto) => {
    const [result] = await db
      .insert(toDoSchema)
      .values(createToDoDto)
      .returning();

    return {
      id: result.id,
      name: result.name,
      archived: result.archived,
      status: result.status,
      created_at: result.createdAt.getTime(),
      updated_at: result.updatedAt.getTime(),
    };
  },

  update: async (updateToDoDto, id) => {
    const [result] = await db
      .update(toDoSchema)
      .set(updateToDoDto)
      .where(eq(toDoSchema.id, Number(id)))
      .returning();

    return {
      id: result.id,
      name: result.name,
      archived: result.archived,
      status: result.status,
      created_at: result.createdAt.getTime(),
      updated_at: result.updatedAt.getTime(),
    };
  },

  delete: async (id) => {
    const [result] = await db
      .delete(toDoSchema)
      .where(eq(toDoSchema.id, Number(id)))
      .returning();

    return {
      id: result.id,
      name: result.name,
      archived: result.archived,
      status: result.status,
      created_at: result.createdAt.getTime(),
      updated_at: result.updatedAt.getTime(),
    };
  },

  transaction: (callback) => db.transaction(callback),
});

export default createRepository;
