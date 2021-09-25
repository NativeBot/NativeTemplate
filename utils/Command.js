const strings = language => require("../langs/" + language + ".json");
const SubCommandArgument = require("./arguments/SubCommandArgument");
const SubCommandGroupArgument = require("./arguments/SubCommandGroupArgument");
const {CommandInteraction, Client} = require("discord.js");
const CommandArgument = require("./CommandArgument");
const CommandCategory = require("./CommandCategory");
const UserCategory = require("./categories/UserCategory");
const LevelCategory = require("./categories/LevelCategory");
const ModerationCategory = require("./categories/ModerationCategory");

class Command extends require("./CommandUtils") {
    /**
     * @param {string} language
     * @param {string} name
     * @param {string} description
     * @param {CommandArgument[]} options
     * @param {boolean} enabled
     * @param {CommandCategory | UserCategory | LevelCategory | ModerationCategory | function} category
     */
    constructor(language, name, description, options, enabled, category) {
        super();
        this._language = language;
        this._name = name;
        this._description = description;
        this._options = options || [];
        this._enabled = enabled;
        this._category = category;
    }

    getLanguage() {
        return this._language;
    }

    /*** @returns {string} */
    getName() {
        return this._name;
    }

    getDescription() {
        return this._description;
    }

    getOptions() {
        return this._options;
    }

    isEnabled() {
        return this._enabled;
    }

    hasCategory() {
        return this.getCategory() instanceof require("../utils/CommandCategory");
    }

    getCategory() {
        return this._category ? new this._category() : null;
    }

    getUsage() {
        return "/" + this.getName() + " " + this.getOptions().map(i => i.__toString(this)).join(this.getOptions().some(opt => opt instanceof SubCommandArgument || opt instanceof SubCommandGroupArgument) ? "\n/" + this.getName() + " " : " ");
    }

    encode() {
        return {
            name: this.getName(),
            description: this.getDescription(),
            options: this.getOptions().map(i => i.encode()),
            defaultPermission: this.isEnabled(),
            type: "COMMAND"
        };
    }

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {}

    translate(string, args = {}) {
        return Command.translate(this.getLanguage(), string, args);
    }

    async translateGuild(guild, string, args = {}) {
        return Command.translate((await require("../utils/Database").getGuild(guild.id)).language, string, args);
    }
}

Command["translate"] = (language, string = "", args = {}) => {
    const str = string;
    if(!str) throw new Error("Undefined string!");
    string = strings(language)[string];
    Object.keys(args).forEach(key => string = string.replace("{" + key + "}", args[key]));
    return string || console.error("String " + str + " not found in " + language);
}

Command.canNonForceLoad = true;

module.exports = Command;