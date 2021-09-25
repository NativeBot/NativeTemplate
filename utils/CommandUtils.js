const Database = require("./Database");

module.exports = class CommandUtils {
    constructor() {
        this._userPermissions = [];
        this._botPermissions = [];
        this._userCooldown = 0;
        this._serverCooldown = 0;
        this._globalCooldown = 0;
        this._ephemeral = false;
    }

    getUserPermissions() {
        return this._userPermissions;
    }

    addUserPermission(permission) {
        this._userPermissions.push(permission);
    }

    removeUserPermission(permission) {
        this._userPermissions = this._userPermissions.filter(i=> i !== permission);
    }

    getBotPermissions() {
        return this._botPermissions;
    }

    addBotPermission(permission) {
        this._botPermissions.push(permission);
    }

    removeBotPermission(permission) {
        this._botPermissions = this._botPermissions.filter(i=> i !== permission);
    }

    getUserCooldown() {
        return this._userCooldown;
    }

    setUserCooldown(cooldown) {
        this._userCooldown = cooldown;
    }

    getServerCooldown() {
        return this._serverCooldown;
    }

    setServerCooldown(cooldown) {
        this._serverCooldown = cooldown;
    }

    getGlobalCooldown() {
        return this._globalCooldown;
    }

    setGlobalCooldown(cooldown) {
        this._globalCooldown = cooldown;
    }

    isEphemeral() {
        return this._ephemeral;
    }

    setEphemeral(value = true) {
        this._ephemeral = value;
    }

    async preExecute(client, interaction) {
        const userMember = interaction.member;
        const botMember = interaction.guild.members.cache.get(client.user.id);
        if (!userMember.permissions.has("ADMINISTRATOR") && this.getUserPermissions().some(i => !userMember.permissions.has(i))) {
            const perm = this.getUserPermissions().filter(i => !userMember.permissions.has(i))[0];
            interaction.followUp(this.translate("permission-error", {
                "perm": this.translate(perm)
            })).then(r => r);
            return false;
        }
        if (!userMember.permissions.has("ADMINISTRATOR") && this.getBotPermissions().some(i => !botMember.permissions.has(i))) {
            const perm = this.getBotPermissions().filter(i => !botMember.permissions.has(i))[0];
            interaction.followUp(this.translate("permission-error1", {
                "perm": this.translate(perm)
            })).then(r => r);
            return false;
        }
        if ((Database.getUserCooldown(interaction.user.id, this.getCooldownName()) || 0) > Date.now()) {
            interaction.followUp(this.translate("cooldown-error-user", {
                seconds: ((Database.getUserCooldown(interaction.user.id, this.getCooldownName()) - Date.now()) / 1000).toFixed(2)
            })).then(r => r);
            return false;
        }
        if ((Database.getServerCooldown(interaction.guild.id, this.getCooldownName()) || 0) > Date.now()) {
            interaction.followUp(this.translate("cooldown-error-server", {
                seconds: ((Database.getServerCooldown(interaction.guild.id, this.getCooldownName()) - Date.now()) / 1000).toFixed(2)
            })).then(r => r);
            return false;
        }
        if (Database.getGlobalCooldown(this.getCooldownName()) > Date.now()) {
            interaction.followUp(this.translate("cooldown-error-global", {
                seconds: ((Database.getGlobalCooldown(this.getCooldownName()) - Date.now()) / 1000).toFixed(2)
            })).then(r => r);
            return false;
        }
        Database.setUserCooldown(interaction.user.id, this.getCooldownName(), Date.now() + this.getUserCooldown());
        Database.setServerCooldown(interaction.guild.id, this.getCooldownName(), Date.now() + this.getServerCooldown());
        Database.setGlobalCooldown(this.getCooldownName(), Date.now() + this.getGlobalCooldown());
        this.execute(client, interaction);
        return true;
    }

    getCooldownName(){return this.getName()}

    translate(){throw new Error("No translate() found.")}
    execute(){throw new Error("No execute() found.")}
    getName(){throw new Error("No getName() found")}
}