const Event = require("../utils/Event");
const InteractionManager = require("../utils/InteractionManager");
const CommandManager = require("../utils/CommandManager");
const Command = require("../utils/Command");
const Discord = require("discord.js");

module.exports = class BotEvent extends Event {
    constructor() {
        super("interactionCreate", Event.ON);
    }

    async execute(client, interaction) {
        if (!interaction.guild || interaction.user.bot) return;
        if (interaction.isContextMenu()) {
            const int = InteractionManager.getInteraction((await InteractionManager.getGuildLanguage(interaction.guild)), interaction.commandName);
            if(int) {
                await interaction["deferReply"]({ ephemeral: int.isEphemeral() });
                try {
                    await int.preExecute(client, interaction)
                } catch (err) {
                    console.warn("Exception in /" + int.getName());
                    console.error(err);
                }
            }
        }
        if(!interaction.isCommand()) return;
        const language = await CommandManager.getGuildLanguage(interaction.guild);
        let command = CommandManager.getCommand(language, interaction["commandName"]);
        if (!(command instanceof Command) || !(interaction instanceof Discord.CommandInteraction) || !interaction) return;
        await interaction["deferReply"]({ ephemeral: command.isEphemeral() });
        try {
            await command.preExecute(client, interaction)
        } catch (err) {
            console.warn("Exception in /" + command.getName());
            console.error(err);
        }
    }
}