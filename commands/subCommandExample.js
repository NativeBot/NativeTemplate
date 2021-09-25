const {CommandArguments, CommandCategories} = require("../utils/enums");
const Command = require("../utils/Command");

class BotCommand extends Command {
    constructor(language) {
        const translate = (str) => Command.translate(language, str);
        super(
            language,
            "example2",
            "Example sub command!",
            [
                new CommandArguments.SUB_COMMAND(
                    "mySubCommand", // Name of the sub command
                    "Its a sub command!", // Description of the sub command
                    [ // Options of sub command
                        new CommandArguments.STRING(
                            "myString", // Name of the argument
                            "Its a string argument", // Description of the argument
                            true // Is required?
                        ),
                    ]
                ),
                new CommandArguments.SUB_COMMAND_GROUP(
                    "mySubCommandGroup", // Name of the sub command group
                    "Its a sub command group!", // Description of the sub command group
                    [ // Sub commands of sub command group
                        new CommandArguments.SUB_COMMAND(
                            "mySubCommand", // Name of the sub command
                            "Its a sub command!", // Description of the sub command
                            [ // Options of sub command
                                new CommandArguments.STRING(
                                    "myString", // Name of the argument
                                    "Its a string argument", // Description of the argument
                                    true // Is required?
                                ),
                            ]
                        ),
                    ]
                ),
            ],
            true,
            CommandCategories.USER);
        this.setUserCooldown(3000); // Will user need to wait per command?
        this.setServerCooldown(3000); // Will every server members need to wait per command?
        this.setGlobalCooldown(3000); // Will every bot users need to wait per command?
        this.setEphemeral(true); // Will reply invisible to others?
    }

    async execute(client, interaction) {
        const subCommandName = interaction.options.getSubcommand(false);
        const subCommandGroupName = interaction.options.getSubcommandGroup(false);
        await interaction.followUp("I am working!\nSub command group: " + subCommandGroupName + "\nSub command: " + subCommandName);
    }
}

module.exports = BotCommand;