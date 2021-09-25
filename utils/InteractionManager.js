let interactions = {};

const Interaction = require("./Interaction");
const Database = require("./Database");

const InteractionManager = {
    reset() {
        interactions = {};
        require("fs").readdirSync("./langs").filter(i=> i.endsWith(".json")).map(i=> i.replace(".json", "")).forEach(lang => {
            interactions[lang] = {};
        });
    },
    getInteraction(language, name) {
        if(!interactions[language]) throw new Error("Language " + language + " not found!");
        return interactions[language][name];
    },
    getInteractions(language) {
        if(!interactions[language]) throw new Error("Language " + language + " not found!");
        return interactions[language];
    },
    getAllInteractions() {
        return Object.values(interactions).reduce((a,b)=>[...a, ...b],[]);
    },
    getLanguages() {
        return Object.keys(interactions);
    },
    registerInteraction(interaction, force = false) {
        if(!(new (interaction)("en_US") instanceof Interaction)) throw new Error("Child class Interaction expected");
        const cmdClass = interaction;
        this.getLanguages().forEach(lang => {
            interaction = new cmdClass(lang);
            if(!force && interactions[interaction.getName()]) throw new Error("Interaction " + interaction.getName() + " is already registered!");
            if(!force && !cmdClass.canNonForceLoad) return;
            interactions[lang][interaction.getName()] = interaction
        });
    },
    unregisterInteraction(interaction, force = false) {
        if(!(interaction instanceof Interaction)) throw new Error("Interaction instance expected " + typeof interaction + " provided");
        if(!force && !interactions[interaction.getName()]) throw new Error("Interaction " + interaction.getName() + " is already not registered!");
        this.getLanguages().forEach(lang => delete interactions[lang][interaction.getName()]);
    },
    async getGuildLanguage(guild) {
        return (await Database.getGuild(guild.id)).language;
    }
}

module.exports = InteractionManager;