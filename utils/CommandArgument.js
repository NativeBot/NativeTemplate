module.exports = class CommandArgument {
    constructor(type, name, description, required = false, choices) {
        this._type = type;
        this._name = name;
        this._description = description;
        this._required = required;
        this._choices = choices;
        if(!type || !name || !description) throw new Error("Argument is not valid! " + type + " " +  name + " " + description)
    }
    getName() {return this._name}
    encode() {
        const encoded = {
            type: this._type,
            name: this._name.toLowerCase(),
            description: this._description,
            required: this._required
        };
        if(Array.isArray(this._choices)) {
            if(this._choices.some(i=> !(i instanceof require("./ArgumentChoice")))) throw new Error("Choice[] expected");
            encoded["choices"] = this._choices.map(choice => choice.encode());
        }
        return encoded;
    }
}

module.exports._ALL = {
    BOOLEAN: require("./arguments/CommandBooleanArgument"),
    CHANNEL: require("./arguments/CommandChannelArgument"),
    INTEGER: require("./arguments/CommandIntegerArgument"),
    MENTIONABLE: require("./arguments/CommandMentionableArgument"),
    NUMBER: require("./arguments/CommandNumberArgument"),
    ROLE: require("./arguments/CommandRoleArgument"),
    STRING: require("./arguments/CommandStringArgument"),
    USER: require("./arguments/CommandUserArgument")
};