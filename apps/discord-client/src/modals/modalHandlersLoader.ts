import { Collection } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import type { ModalHandler } from "./Modal";

const modalsFolderPath = __dirname;

export const loadModalHandlers = async () => {
  const modalhandlers = new Collection<string, ModalHandler>();

  type modalHadlerPromise = Promise<{ default: ModalHandler }>;
  const modalHandlerByFilename = (modalFilename: string): modalHadlerPromise =>
    import(path.join(modalsFolderPath, modalFilename));

  const modalsHandlersPromises = fs
    .readdirSync(modalsFolderPath)
    .filter((file) => file.endsWith(".modal.ts"))
    .map(modalHandlerByFilename);

  console.log(
    `Loading ${modalsHandlersPromises.length} application (/) modals.`
  );

  const modalsHandlers = await Promise.all(modalsHandlersPromises);

  modalsHandlers.forEach(({ default: modalHandler }) => {
    if (
      !(
        "name" in modalHandler &&
        "build" in modalHandler &&
        "execute" in modalHandler
      )
    ) {
      console.log(
        `[WARNING] The modal at is missing a required "name", "build" or "execute" property.`
      );
      return;
    }

    modalhandlers.set(modalHandler.name, modalHandler);
  });

  return modalhandlers;
};
