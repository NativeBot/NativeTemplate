module.exports = class extends require("../CommandArgument") {
    constructor(name, description, required = false, choices) {
        super("BOOLEAN", name, description, required, choices);
    }

    __toString() {
        return (this._required ? "[" : "(?") + this.getName() + ": bool" + (this._required ? "]" : ")");
    }
}