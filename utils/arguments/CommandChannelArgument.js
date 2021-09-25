module.exports = class extends require("../CommandArgument") {
    constructor(name, description, required = false, choices) {
        super("CHANNEL", name, description, required, choices);
    }

    __toString() {
        return (this._required ? "[" : "(?") + this.getName() + ": channel" + (this._required ? "]" : ")");
    }
}