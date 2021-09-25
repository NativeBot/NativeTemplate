const reactions = {};
const onceReactions = {};
const Discord = require("discord.js");

module.exports = {
    initEvent(client) {
        if(!(client instanceof Discord.Client)) return;
        client.on("messageReactionAdd", async (reaction, user) => {
            if(reactions[reaction.message.id] && reactions[reaction.message.id][reaction.emoji.identifier]) {
                reactions[reaction.message.id][reaction.emoji.identifier].forEach(callable => callable(reaction, user));
            }
            if(onceReactions[reaction.message.id] && onceReactions[reaction.message.id][reaction.emoji.identifier]) {
                onceReactions[reaction.message.id][reaction.emoji.identifier].forEach(callable => callable(reaction, user));
                delete onceReactions[reaction.message.id][reaction.emoji.identifier];
            }
        });
    },
    registerReaction(messageId, emoji, callable) {
        if(typeof callable !== "function") return;
        if(!reactions[messageId])
            reactions[messageId] = {};
        if(!reactions[messageId][emoji])
            reactions[messageId][emoji] = [];
        reactions[messageId][emoji].push(callable);
        const keys = Object.keys(reactions[messageId][emoji]);
        return keys[keys.length-1];
    },
    unregisterReaction(messageId, emoji, key) {
        if(!reactions[messageId])
            reactions[messageId] = {};
        if(!reactions[messageId][emoji])
            reactions[messageId][emoji] = [];
        delete reactions[messageId][emoji][key];
    },
    registerOnceReaction(messageId, emoji, callable) {
        if(typeof callable !== "function") return;
        if(!onceReactions[messageId])
            onceReactions[messageId] = {};
        if(!onceReactions[messageId][emoji])
            onceReactions[messageId][emoji] = [];
        onceReactions[messageId][emoji].push(callable);
        const keys = Object.keys(onceReactions[messageId][emoji]);
        return keys[keys.length-1];
    },
    unregisterOnceReaction(messageId, emoji, key) {
        if(!onceReactions[messageId])
            onceReactions[messageId] = {};
        if(!onceReactions[messageId][emoji])
            onceReactions[messageId][emoji] = [];
        delete onceReactions[messageId][emoji][key];
    }
}