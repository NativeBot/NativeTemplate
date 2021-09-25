module.exports = class ArgumentChoice {
    constructor(name, value) {
        this._name = name;
        this._value = value;
    }

    encode() {
        return {
            name: this._name,
            value: this._value
        };
    }
}