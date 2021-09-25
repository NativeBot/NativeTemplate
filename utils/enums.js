module.exports = {
    CommandArguments: {
        BOOLEAN: require("./arguments/CommandBooleanArgument"),
        CHANNEL: require("./arguments/CommandChannelArgument"),
        INTEGER: require("./arguments/CommandIntegerArgument"),
        MENTIONABLE: require("./arguments/CommandMentionableArgument"),
        NUMBER: require("./arguments/CommandNumberArgument"),
        ROLE: require("./arguments/CommandRoleArgument"),
        STRING: require("./arguments/CommandStringArgument"),
        USER: require("./arguments/CommandUserArgument"),
        SUB_COMMAND: require("./arguments/SubCommandArgument"),
        SUB_COMMAND_GROUP: require("./arguments/SubCommandGroupArgument")
    },
    CommandCategories: {
        USER: require("./categories/UserCategory"),
        MODERATION: require("./categories/ModerationCategory"),
        LEVEL: require("./categories/LevelCategory"),
    },
    ArgumentChoice: require("./ArgumentChoice"),
    Database: require("./Database"),
    ReactionManager: require("./ReactionManager"),
    ButtonManager: require("./ButtonManager"),
    Utils: require("./Utils"),
    Command: require("./Command"),
    CommandManager: require("./CommandManager"),
    Interaction: require("./Interaction"),
    InteractionManager: require("./InteractionManager"),
    InteractionTypes: {
        CHAT_INPUT: require("./interactions/ChatInputInteraction"),
        MESSAGE: require("./interactions/MessageInteraction"),
        USER: require("./interactions/UserInteraction"),
    },
    CommandUtils: require("./CommandUtils"),
};