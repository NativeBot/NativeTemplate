module.exports = class ChatInputInteraction extends require("../Interaction") {
    constructor(language, name, enabled) {
        super(language, name, enabled, "USER");
    }

    getUser(interaction) {
        return interaction.client.users.cache.get(interaction.targetId);
    }

    getMember(interaction) {
        return interaction.guild.members.cache.get(interaction.targetId);
    }
}