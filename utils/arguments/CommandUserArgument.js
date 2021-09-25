module.exports = class extends require("../CommandArgument") {
    constructor(name, description, required = false, choices) {
        super("USER", name, description, required, choices);
    }

    __toString() {
        return (this._required ? "[" : "(?") + this.getName() + ": user" + (this._required ? "]" : ")");
    }
}