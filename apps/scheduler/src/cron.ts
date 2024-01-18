import createToDoCronRuleRepository from "@to-bot/database/repositories/to-do-cron-rule.repository";

import type { Cron, Database } from "./types";

export const clearCronJobs = async (cron: Cron) => {
  const tasks = cron.getTasks();

  tasks.forEach((task) => task.stop());
};

export const setupCronJobs = async (cron: Cron, database: Database) => {
  const toDoCronRuleRepository = createToDoCronRuleRepository(database);
  const cronjobs = await toDoCronRuleRepository.findAll();

  cronjobs.forEach((job) =>
    cron.schedule(job.cron, () => console.log("running job", job.id), {
      name: String(job.id),
    })
  );
};
