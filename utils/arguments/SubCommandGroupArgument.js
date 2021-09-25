module.exports = class extends require("../CommandArgument") {
    constructor(name, description, options) {
        super("SUB_COMMAND_GROUP", name, description);
        delete this._choices;
        this._options = options;
        if(this._options.some(i=> !(i instanceof require("./SubCommandArgument")))) throw new Error("Things that they are not sub command cannot be in a sub command group.");
    }

    getOptions() {
        return this._options;
    }

    /**
     * @returns {{name: string, options: *[], description, type}}
     */
    encode() {
        return {
            type: this._type,
            name: this._name.toLowerCase(),
            description: this._description,
            options: (this._options || []).map(option => option.encode())
        };
    }

    __toString(cmd) {
        return this._name + " " + this._options.map(i=> i.__toString(cmd)).join("\n/" + cmd.getName() + " ");
    }
}