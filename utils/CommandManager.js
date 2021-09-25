let commands = {};

const Command = require("./Command");
const Database = require("./Database");
const InteractionManager = require("./InteractionManager");

const CommandManager = {
    reset() {
        commands = {};
        require("fs").readdirSync("./langs").filter(i=> i.endsWith(".json")).map(i=> i.replace(".json", "")).forEach(lang => {
            commands[lang] = {};
        });
    },
    getCommand(language, name) {
        if(!commands[language]) throw new Error("Language " + language + " not found!");
        return commands[language][name];
    },
    getCommands(language) {
        if(!commands[language]) throw new Error("Language " + language + " not found!");
        return commands[language];
    },
    getAllCommands() {
        return Object.values(commands).reduce((a,b)=>[...a, ...b],[]);
    },
    getLanguages() {
        return Object.keys(commands);
    },
    registerCommand(command, force = false) {
        if(!((new command("en_US")) instanceof Command)) throw new Error("Child class Command expected");
        const cmdClass = command;
        this.getLanguages().forEach(lang => {
            command = new cmdClass(lang);
            if(!force && commands[command.getName()]) throw new Error("Command " + command.getName() + " is already registered!");
            if(!force && !cmdClass.canNonForceLoad) return;
            commands[lang][command.getName()] = command
        });
    },
    unregisterCommand(command, force = false) {
        if(!(command instanceof Command)) throw new Error("Command instance expected " + typeof command + " provided");
        if(!force && !commands[command.getName()]) throw new Error("Command " + command.getName() + " is already not registered!");
        this.getLanguages().forEach(lang => delete commands[lang][command.getName()]);
    },
    async getGuildLanguage(guild) {
        return (await Database.getGuild(guild.id)).language;
    },
    async getDisabledCommandNames(guild) {
        const settings = (await Database.getGuild(guild.id)).settings || {};
        return settings["disabledCommands"] || [];
    },
    async getGuildCommands(guild) {
        const disabled = await this.getDisabledCommandNames(guild);
        return [
            ...Object.values(CommandManager.getCommands(await CommandManager.getGuildLanguage(guild))).filter(i => !disabled.includes(i._name)),
            ...Object.values(InteractionManager.getInteractions(await InteractionManager.getGuildLanguage(guild)))
        ];
    }
}

module.exports = CommandManager;