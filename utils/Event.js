const Event = class Event {
    constructor(name, type = Event.ON) {
        this._name = name;
        this._type = type;
    }
    execute() {throw new Error("You should provide an execution!")}
    async translateGuild(guild, string, args) {return this.translate(await require("./CommandManager").getGuildLanguage(guild), string , args)}
    translate(language, string, args) {return require("./Command").translate(language, string, args)}
}
Event.ON = 0;
Event.ONCE = 1;
module.exports = Event;