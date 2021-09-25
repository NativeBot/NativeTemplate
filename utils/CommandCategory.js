module.exports = class CommandCategory {
    constructor(name) {
        this._name = name;
    }
    getName() {
        return this._name;
    }
}