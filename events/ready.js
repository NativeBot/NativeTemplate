const Event = require("../utils/Event");

module.exports = class BotEvent extends Event {
    constructor() {
        super("ready", Event.ONCE);
    }

    execute(client) {
        console.info("[Native] I am ready!");
        setTimeout(require("../index").refreshAllGuildsPacket, 2000);
        require("../utils/ButtonManager").initEvent(client);
        require("../utils/ReactionManager").initEvent(client);
        client.user.setPresence({
            status: "idle",
            afk: true,
            activities: [
                {
                    name: "Example discord.js v13 Template by Native v1",
                    type: "WATCHING"
                }
            ]
        });
    }

}