const CommandManager = require("./utils/CommandManager");
const InteractionManager = require("./utils/InteractionManager");
module.exports.__dirname = __dirname;
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_BANS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_INTEGRATIONS',
        'GUILD_WEBHOOKS',
        'GUILD_INVITES',
        'GUILD_VOICE_STATES',
        'GUILD_PRESENCES',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING',
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
        'DIRECT_MESSAGE_TYPING'
    ]
});

module.exports.getClient = () => client;

const MainLanguage = require("./langs/en_US.json");

CommandManager.getLanguages().filter(i => i !== "en_US").forEach(lang => {
    const l = lang;
    lang = require("./langs/" + l + ".json");
    const nons = ["AVATAR"];
    Object.keys(MainLanguage).filter(i => !i.startsWith("/") && !i.includes(" ") && !nons.includes(i)).forEach(key => {
        if (!lang[key]) {
            const f = fs.readFileSync("./langs/en_US.json").toString();
            const line = Object.keys(f.split("\n")).filter(j => f.split("\n")[j].startsWith(`  "${key}": `))[0];
            console.error("Language " + l + " doesn't have " + key + " string (line " + (line ? (line * 1) + 1 : "NaN") + ")!");
        }
    });
});

module.exports.refreshCommands = () => {
    CommandManager.reset();
    fs.readdirSync("./commands").forEach(file => {
        CommandManager.registerCommand(require("./commands/" + file));
    });
}

module.exports.refreshInteractions = () => {
    InteractionManager.reset();
    fs.readdirSync("./interactions").forEach(file => {
        InteractionManager.registerInteraction(require("./interactions/" + file));
    });
}

module.exports.refreshCommands();
module.exports.refreshInteractions();

const Event = require("./utils/Event");

const evs = {};

fs.readdirSync("./events").forEach(file => {
    const f = file;
    file = new (require("./events/" + file))();
    file._file = f;
    if (!(file instanceof Event)) throw new Error("Non-event file found!");
    switch (file._type) {
        case Event.ON:
        case Event.ONCE:
            if (!evs[file._name]) evs[file._name] = {};
            if (!evs[file._name][file._type]) evs[file._name][file._type] = [];
            evs[file._name][file._type].push(file);
            break;
        default:
            throw new Error("Invalid event type " + file._type);
    }
});

Object.keys(evs).forEach(name => {
    Object.keys(evs[name]).forEach(type => {
        const files = evs[name][type];
        client[["on", "once"][type]](name, (...args) => files.forEach(file => {
            try {
                file["execute"](...[client, ...args])
            } catch (e) {
                console.error("Error happened in event " + file._file);
                console.error(e);
            }
        }))
    });
});

module.exports.getGuildPacket = async (guild) => (await CommandManager.getGuildCommands(guild)).map(i => i.encode());

module.exports.refreshGuildPacket = async (guild) => {
    const pk = await module.exports.getGuildPacket(guild);
    guild.commands.set(pk)
        .catch(console.error);
}

module.exports.refreshAllGuildsPacket = () => {
    client.guilds.cache.each(module.exports.refreshGuildPacket);
}

client.login(fs.readFileSync("./token.txt").toString()).then(r => r);