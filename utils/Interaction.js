const strings = language => require("../langs/" + language + ".json");
const {ContextMenuInteraction, Client} = require("discord.js");

class Interaction extends require("./CommandUtils") {
    constructor(language, name, enabled, type) {
        super();
        this._language = language;
        this._name = name;
        this._enabled = enabled;
        this._type = type;
    }

    getLanguage() {
        return this._language;
    }

    getName() {
        return this._name;
    }

    isEnabled() {
        return this._enabled;
    }

    getType() {
        return this._type;
    }

    encode() {
        return {
            name: this.getName(),
            required: this.isEnabled(),
            type: this._type
        };
    }

    /**
     * @param {Client} client
     * @param {ContextMenuInteraction} interaction
     */
    async execute(client, interaction) {}

    translate(string, args = {}) {
        return Interaction.translate(this.getLanguage(), string, args);
    }

    async translateGuild(guild, string, args = {}) {
        return Interaction.translate((await require("../utils/Database").getGuild(guild.id)).language, string, args);
    }
}

Interaction["translate"] = (language, string, args = {}) => {
    const str = string;
    if(!str) throw new Error("Undefined string!");
    string = strings(language)[string];
    Object.keys(args).forEach(key => string = string.replace("{" + key + "}", args[key]));
    return string || console.error("String " + str + " not found in " + language);
}

Interaction.canNonForceLoad = true;

module.exports = Interaction;