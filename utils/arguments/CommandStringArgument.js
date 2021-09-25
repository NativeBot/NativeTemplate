module.exports = class extends require("../CommandArgument") {
    constructor(name, description, required = false, choices) {
        super("STRING", name, description, required, choices);
    }

    __toString() {
        return (this._required ? "[" : "(?") + this.getName() + ": string" + (this._required ? "]" : ")");
    }
}