import type {
    ContextMenuCommandBuilder, ContextMenuCommandInteraction,
} from "discord.js";
import type { Knex } from "knex";

export type ContextMenuCommandHandler = {
    data: ContextMenuCommandBuilder;
    execute: (
        interaction: ContextMenuCommandInteraction,
        db: Knex,
    ) => Promise<void>;
};
