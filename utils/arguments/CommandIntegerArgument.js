module.exports = class extends require("../CommandArgument") {
    constructor(name, description, required = false, choices) {
        super("INTEGER", name, description, required, choices);
    }

    __toString() {
        return (this._required ? "[" : "(?") + this.getName() + ": int" + (this._required ? "]" : ")");
    }
}