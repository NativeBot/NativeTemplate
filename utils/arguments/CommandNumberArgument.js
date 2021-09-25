module.exports = class extends require("../CommandArgument") {
    constructor(name, description, required = false, choices) {
        super("NUMBER", name, description, required, choices);
    }

    __toString() {
        return (this._required ? "[" : "(?") + this.getName() + ": number" + (this._required ? "]" : ")");
    }
}