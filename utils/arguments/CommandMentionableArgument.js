module.exports = class extends require("../CommandArgument") {
    constructor(name, description, required = false, choices) {
        super("MENTIONABLE", name, description, required, choices);
    }

    __toString() {
        return (this._required ? "[" : "(?") + this.getName() + ": mention" + (this._required ? "]" : ")");
    }
}