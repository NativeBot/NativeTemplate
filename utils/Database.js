const sqlite = require("better-sqlite3")("./data.sqlite");

module.exports = {
    getSqlite() {
        return sqlite
    },
    createGuildTable() {
        return sqlite.exec(`CREATE TABLE IF NOT EXISTS guilds
                            (
                                id       TEXT PRIMARY KEY,
                                language TEXT NOT NULL DEFAULT 'en_US'
                            )`);
    },
    createUserCooldownsTable() {
        return sqlite.exec(`CREATE TABLE IF NOT EXISTS userCooldowns
                            (
                                commandName TEXT    NOT NULL,
                                userId      TEXT    NOT NULL,
                                endsAt      INTEGER NOT NULL
                            )`);
    },
    createServerCooldownsTable() {
        return sqlite.exec(`CREATE TABLE IF NOT EXISTS serverCooldowns
                            (
                                commandName TEXT    NOT NULL,
                                serverId    TEXT    NOT NULL,
                                endsAt      INTEGER NOT NULL
                            )`);
    },
    createGlobalCooldownsTable() {
        return sqlite.exec(`CREATE TABLE IF NOT EXISTS globalCooldowns
                            (
                                commandName TEXT    NOT NULL,
                                endsAt      INTEGER NOT NULL
                            )`);
    },
    getUserCooldown(userId, commandName) {
        const res = sqlite.prepare(`SELECT endsAt
                                    FROM userCooldowns
                                    WHERE userId = '${userId}'
                                      AND commandName = '${commandName}'`).all()[0];
        return res ? res["endsAt"] : null;
    },
    setUserCooldown(userId, commandName, endsAt) {
        if (this.getUserCooldown(userId, commandName)) {
            return sqlite.exec(`UPDATE userCooldowns
                                SET endsAt = ${endsAt}
                                WHERE userId = '${userId}'
                                  AND commandName = '${commandName}'`);
        }
        return sqlite.exec(`INSERT INTO userCooldowns (commandName, userId, endsAt)
                            VALUES ('${commandName}', '${userId}', ${endsAt})`);
    },
    getServerCooldown(serverId, commandName) {
        const res = sqlite.prepare(`SELECT endsAt
                                    FROM serverCooldowns
                                    WHERE serverId = '${serverId}'
                                      AND commandName = '${commandName}'`).all()[0];
        return res ? res["endsAt"] : null;
    },
    setServerCooldown(serverId, commandName, endsAt) {
        if (this.getServerCooldown(serverId, commandName)) {
            return sqlite.exec(`UPDATE serverCooldowns
                                SET endsAt = ${endsAt}
                                WHERE serverId = '${serverId}'
                                  AND commandName = '${commandName}'`);
        }
        return sqlite.exec(`INSERT INTO serverCooldowns (commandName, serverId, endsAt)
                            VALUES ('${commandName}', '${serverId}', ${endsAt})`);
    },
    getGlobalCooldown(commandName) {
        const res = sqlite.prepare(`SELECT endsAt
                                    FROM globalCooldowns
                                    WHERE commandName = '${commandName}'`).all()[0];
        return res ? res["endsAt"] : null;
    },
    setGlobalCooldown(commandName, endsAt) {
        if (this.getGlobalCooldown(commandName)) {
            return sqlite.exec(`UPDATE globalCooldowns
                                SET endsAt = ${endsAt}
                                WHERE commandName = '${commandName}'`);
        }
        return sqlite.exec(`INSERT INTO globalCooldowns (commandName, endsAt)
                            VALUES ('${commandName}', ${endsAt})`);
    },
    async createGuild(id) {
        if (await this.getGuild(id, false)) return sqlite;
        return sqlite.exec(`INSERT INTO guilds (id, language)
                            VALUES ('${id}', 'en_US')`)
    },
    async getGuild(id, create = true) {
        if (create) await this.createGuild(id);
        const a = sqlite.prepare(`SELECT *
                                  FROM guilds
                                  WHERE id = '${id}'`).all()[0];
        try {
            a["settings"] = JSON.parse(a["settings"]);
        } catch (e) {
        }
        return a;
    },
    setGuildLanguage(id, language = "en_US") {
        const CommandManager = require("./CommandManager");
        if (!CommandManager.getLanguages().includes(language)) throw new Error("Language " + language + " not found!");
        return sqlite.exec(`UPDATE guilds
                            SET language = '${language}'
                            WHERE id = '${id}'`);
    },
    getUniqueId() {
        sqlite.exec(`CREATE TABLE IF NOT EXISTS uniqueId
                     (
                         i  INTEGER PRIMARY KEY,
                         id INTEGER
                     )`);
        const res = sqlite.prepare(`SELECT id
                                    FROM uniqueId
                                    WHERE i = 0`).all()[0];
        if (!res) {
            sqlite.exec(`INSERT INTO uniqueId (i, id)
                         VALUES (0, 0)`);
            return sqlite.prepare(`SELECT id
                                   FROM uniqueId
                                   WHERE i = 0`).all()[0].id;
        }
        sqlite.exec(`UPDATE uniqueId
                     SET id = id + 1
                     WHERE i = 0`);
        return res.id;
    }
};
module.exports.createGuildTable();
module.exports.createUserCooldownsTable();
module.exports.createServerCooldownsTable();
module.exports.createGlobalCooldownsTable();