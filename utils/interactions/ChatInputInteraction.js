module.exports = class ChatInputInteraction extends require("../Interaction") {
    constructor(language, name, description, enabled) {
        super(language, name, enabled, "CHAT_INPUT");
        this._description = description;
    }

    getDescription() {
        return this._description;
    }

    getMessage(interaction) {
        return interaction.channel.messages.cache.get(interaction.targetId);
    }

    encode() {
        return {
            name: this.getName(),
            description: this.getDescription(),
            required: this.isEnabled(),
            type: this._type
        };
    }
}