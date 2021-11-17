const EmbedBuilder = require("./embed_builder")

/**
 * 
 * @param {String} path The absolute path to your .deml file
 * @returns {EmbedBuilder}
 */
module.exports = function(path) {
    return new EmbedBuilder(path);
}