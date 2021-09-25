const {CommandArguments, CommandCategories, ArgumentChoice} = require("../utils/enums");
const Command = require("../utils/Command");

class BotCommand extends Command {
    constructor(language) {
        const translate = (str) => Command.translate(language, str);
        super(
            language,
            "example",
            "Example command!",
            [
                new CommandArguments.INTEGER(
                    "myInteger", // Name of the argument
                    "Its an integer argument", // Description of the argument
                    false, // Is required?
                    [
                        new ArgumentChoice( // Choices for argument
                            "One",
                            1
                        ),
                        new ArgumentChoice(
                            "Two",
                            2
                        )
                    ]
                ),
                new CommandArguments.BOOLEAN(
                    "myBoolean", // Name of the argument
                    "Its a boolean argument!", // Description of the argument
                    false // Is required?
                ),
                new CommandArguments.CHANNEL(
                    "myChannel", // Name of the argument
                    "Its a channel argument", // Description of the argument
                    false // Is required?
                ),
                new CommandArguments.MENTIONABLE(
                    "myMentionable", // Name of the argument
                    "Its a mentionable argument", // Description of the argument
                    false // Is required?
                ),
                new CommandArguments.NUMBER(
                    "myNumber", // Name of the argument
                    "Its a number argument", // Description of the argument
                    false // Is required?
                ),
                new CommandArguments.ROLE(
                    "myRole", // Name of the argument
                    "Its a role argument", // Description of the argument
                    false // Is required?
                ),
                new CommandArguments.STRING(
                    "myString", // Name of the argument
                    "Its a string argument", // Description of the argument
                    false // Is required?
                ),
                new CommandArguments.USER(
                    "myUser", // Name of the argument
                    "Its a user argument", // Description of the argument
                    false // Is required?
                )
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