module.exports = class extends require("../CommandArgument") {
    constructor(name, description, required = false, choices) {
        super("ROLE", name, description, required, choices);
    }

    __toString() {
        return (this._required ? "[" : "(?") + this.getName() + ": role" + (this._required ? "]" : ")");
    }
}