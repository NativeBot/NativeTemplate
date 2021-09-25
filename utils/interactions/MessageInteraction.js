module.exports = class ChatInputInteraction extends require("../Interaction") {
    constructor(language, name, enabled) {
        super(language, name, enabled, "MESSAGE");
    }

    getMessage(interaction) {
        return interaction.channel.messages.cache.get(interaction.targetId);
    }
}