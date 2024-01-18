import { eq } from "drizzle-orm";
import type { Database, Transaction } from "../";
import { toDoCronRuleSchema } from "../schemas";

export type ToDoCronRuleDto = {
  id: number;
  cron: string;
  runnedAt?: number;
};

export type CreateToDoCronRuleDto = {
  id: number;
  cron: string;
};

export type UpdateToDoCronRuleDto = {
  cron?: string;
  disabled?: boolean;
  runnedAt?: number | null;
};

export type ToDoCronRuleRepository = {
  find: (id: string) => Promise<ToDoCronRuleDto | undefined>;
  findAll: () => Promise<ToDoCronRuleDto[]>;
  create: (createToDoDto: CreateToDoCronRuleDto) => Promise<ToDoCronRuleDto>;
  update: (
    updateToDoDto: UpdateToDoCronRuleDto,
    id: string
  ) => Promise<ToDoCronRuleDto>;
  delete: (id: string) => Promise<ToDoCronRuleDto>;
  transaction: <T>(callback: (trx: Transaction) => Promise<T>) => Promise<T>;
};

const createRepository = (db: Database): ToDoCronRuleRepository => ({
  find: async (id) => {
    const [result] = await db
      .select()
      .from(toDoCronRuleSchema)
      .where(eq(toDoCronRuleSchema.id, Number(id)));

    return {
      id: result.id,
      cron: result.cron,
      disabled: result.disabled,
      runnedAt: result.runnedAt?.getTime(),
    };
  },

  findAll: async () => {
    const results = await db.select().from(toDoCronRuleSchema);

    return results.map((result) => ({
      id: result.id,
      cron: result.cron,
      disabled: result.disabled,
      runnedAt: result.runnedAt?.getTime(),
    }));
  },

  create: async (createToDoCronRuleDto) => {
    const [result] = await db
      .insert(toDoCronRuleSchema)
      .values(createToDoCronRuleDto)
      .returning();

    return {
      id: result.id,
      cron: result.cron,
      disabled: result.disabled,
      runnedAt: result.runnedAt?.getTime(),
    };
  },

  update: async (updateToDoCronRuleDto, id) => {
    const runnedAt =
      typeof updateToDoCronRuleDto.runnedAt === "number"
        ? new Date(updateToDoCronRuleDto.runnedAt)
        : updateToDoCronRuleDto.runnedAt;

    const [result] = await db
      .update(toDoCronRuleSchema)
      .set({
        disabled: updateToDoCronRuleDto.disabled,
        cron: updateToDoCronRuleDto.cron,
        runnedAt,
      })
      .where(eq(toDoCronRuleSchema.id, Number(id)))
      .returning();

    return {
      id: result.id,
      cron: result.cron,
      disabled: result.disabled,
      runnedAt: result.runnedAt?.getTime(),
    };
  },

  delete: async (id) => {
    const [result] = await db
      .delete(toDoCronRuleSchema)
      .where(eq(toDoCronRuleSchema.id, Number(id)))
      .returning();

    return {
      id: result.id,
      cron: result.cron,
      disabled: result.disabled,
      runnedAt: result.runnedAt?.getTime(),
    };
  },

  transaction: (callback) => db.transaction(callback),
});

export default createRepository;
