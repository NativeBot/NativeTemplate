const buttons = {};
const onceButtons = {};
const Discord = require("discord.js");

module.exports = {
    initEvent(client) {
        if(!(client instanceof Discord.Client)) return;
        client.on("interactionCreate", async interaction => {
            if(!interaction.isButton() || !(interaction instanceof Discord.ButtonInteraction)) return;
            if(buttons[interaction.customId]) buttons[interaction.customId].forEach(callable => callable(interaction));
            if(onceButtons[interaction.customId]) onceButtons[interaction.customId].forEach(callable => callable(interaction));
            delete onceButtons[interaction.customId];
        });
    },
    registerButton(button, callable) {
        if(typeof callable !== "function") return;
        if(!buttons[button instanceof Discord.MessageButton ? button.customId : button])
            buttons[button instanceof Discord.MessageButton ? button.customId : button] = [];
        buttons[button instanceof Discord.MessageButton ? button.customId : button].push(callable);
        const keys = Object.keys(buttons[button instanceof Discord.MessageButton ? button.customId : button]);
        return keys[keys.length-1];
    },
    unregisterButton(button, key) {
        if(!buttons[button instanceof Discord.MessageButton ? button.customId : button])
            buttons[button instanceof Discord.MessageButton ? button.customId : button] = [];
        delete buttons[button instanceof Discord.MessageButton ? button.customId : button][key];
    },
    registerOnceButton(button, callable) {
        if(typeof callable !== "function") return;
        if(!onceButtons[button instanceof Discord.MessageButton ? button.customId : button])
            onceButtons[button instanceof Discord.MessageButton ? button.customId : button] = [];
        onceButtons[button instanceof Discord.MessageButton ? button.customId : button].push(callable);
        const keys = Object.keys(onceButtons[button instanceof Discord.MessageButton ? button.customId : button]);
        return keys[keys.length-1];
    },
    unregisterOnceButton(button, key) {
        if(!onceButtons[button instanceof Discord.MessageButton ? button.customId : button])
            onceButtons[button instanceof Discord.MessageButton ? button.customId : button] = [];
        delete onceButtons[button instanceof Discord.MessageButton ? button.customId : button][key];
    }
}