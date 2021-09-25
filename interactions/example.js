const {InteractionTypes} = require("../utils/enums");

class BotInteraction extends InteractionTypes.USER { // MESSAGE | USER
    constructor(language) {
        super(
            language,
            "example3", // Description of interaction
            true // Is enabled?
        );
        this.setUserCooldown(3000); // Will user need to wait per command?
        this.setServerCooldown(3000); // Will every server members need to wait per command?
        this.setGlobalCooldown(3000); // Will every bot users need to wait per command?
        this.setEphemeral(true); // Will reply invisible to others?
    }

    async execute(client, interaction) {
        const user = this.getUser(interaction); // clicked user
        const member = this.getMember(interaction); // clicked member
        // const message = this.getMessage(interaction); // for MESSAGE
        await interaction.followUp("I am working! You clicked <@" + user.id + ">");
    }
}

module.exports = BotInteraction;