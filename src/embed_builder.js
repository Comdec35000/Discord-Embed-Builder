
const fs = require('fs');
const Lexer = require('./lexer/lexer.js');


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
        console.log(tokens);

    }

}

module.exports = EmbedBuilder;
