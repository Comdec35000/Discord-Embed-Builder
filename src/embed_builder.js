
const fs = require('fs');
const Compiler = require('./compiler/compiler.js');
const Lexer = require('./lexer/lexer.js');
const Parser = require('./parser/parser.js');
const { MessageEmbed } = require('discord.js');

class EmbedBuilder {

    static content;
    static params;

    constructor(path) {
        this.content = fs.readFileSync(path, 'utf8');
    }

    /**
     * 
     * @param {Object} params An object that contains all the variables you want to put inside the embed
     */
    format(params) {
        this.params = params;
        return this;

    }

    /**
     * 
     * @returns {Object} An objet that represent a discord message content 
     */
    create() {

        for(const key in this.params) {
            this.content = this.content.replace(/<\$+\w+>/g, this.params[key]);
        }

        this.content = this.content.replace(/<(\/)?§b>/g, "**");
        this.content = this.content.replace(/<(\/)?§i>/g, "_");
        this.content = this.content.replace(/<(\/)?§u>/g, "__");
        this.content = this.content.replace(/<(\/)?§r>/g, "`");
        this.content = this.content.replace(/<(\/)?§s>/g, "~~");

        const tokens = new Lexer(this.content).lex();
        const embedData = new Parser(tokens, this.content).parse();
        const messageEmbeds = new Compiler(embedData, this.content).compil();

        return messageEmbeds;

    }

}

module.exports = EmbedBuilder;
