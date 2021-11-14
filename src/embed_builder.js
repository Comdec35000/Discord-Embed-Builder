
const fs = require('fs');
const Compiler = require('./compiler/compiler.js');
const Lexer = require('./lexer/lexer.js');
const Parser = require('./parser/parser.js');

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

    create() {

        for(const key in this.params) {
            this.content = this.content.replace(/<\$+\w+>/g, this.params[key]);
        }

        const tokens = new Lexer(this.content).lex();
        const embedData = new Parser(tokens).parse();
        const messageEmbeds = new Compiler(embedData).compil();

        return messageEmbeds;

    }

}

module.exports = EmbedBuilder;
