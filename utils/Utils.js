let unique = 0;
module.exports = {
    isDir(file) {
        return require("fs").lstatSync(file).isDirectory();
    },
    readdirCompletely(dir) {
        let files = [];
        require("fs").readdirSync(dir).forEach(file => {
            if (!this.isDir(dir + "/" + file)) {
                files.push(dir + "/" + file);
            } else {
                files = [...files, ...this.readdirCompletely(dir + "/" + file)];
            }
        });
        return files;
    },
    getRunningUniqueId() {
        return unique++;
    }
};