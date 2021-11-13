
const Token = require('./token.js');


class Lexer {

    variableChars = /[a-zA-Z0-9_]+/;

    ERRORS = {
        unexpectedSyntax : "DiscordEmbedBuilder.Error.UnexpectedSyntax : "
    }

    constructor(content) {

        var body = [];

        content = content.split(/\r?\n/);
        for(let ln of content) {
            ln = ln.replace(/(\t+)/, '');
            ln = ln.split('');

            while(ln[0] == ' ') {
                ln.shift();
            }

            body.push(ln)
        }


        this.content = body;

        this.ln = 0;
        this.col = -1;

        this.tokens = [];
        
    }

    advance() {
        let newline = false;

        this.col++;
        if(this.content[this.ln][this.col] == "\n") {
            this.col = 0;
            this.ln++;
            newline = true;
        }
        this.currentChar = this.content[this.ln][this.col];
        return newline;
    }

    advanceNoNewlines() {
        if(this.advance()) throw new Error(this.ERRORS.unexpectedSyntax + this.showContext(this.col));
    }

    lex() {

        while(!(this.ln == this.content.length + 1)) {
            this.advance();

            console.log("aaaaa");

            if(this.currentChar === '<') {
                this.buildTag();
            } else {
                this.buildContent();
            }
        }

        return this.tokens;

    }

    buildTag() {

        let token = new Token();
        
        this.advanceNoNewlines();

        if(this.currentChar == '/') {
            token.type = Token.types.TAG_CLOSE;
            this.advanceNoNewlines();
        }

        let keyword = this.buildWord();
        token.content.tagType = keyword;

        while(this.currentChar != '>') {
            this.advanceNoNewlines();
            if(!this.currentChar) break;

            if(this.currentChar == '/') token.type = Token.types.BLOCK_TAG;

            if(this.variableChars.test(this.currentChar)){
                token.content.args = token.content.args ?? {};
                token.content.args[this.buildWord()] = this.buildArg();
            }
        }

        if(!token.type) token.type = Token.types.TAG_OPEN;

        console.log(token);

        return this.tokens.push(token);

    }

    buildWord() {

        var word = '';


        while(this.currentChar && this.variableChars.test(this.currentChar.toString())) {
            word += this.currentChar;
            this.advanceNoNewlines();
        }

        return word;

    }

    buildArg() {
        if(!this.currentChar == '=') return;
        this.advanceNoNewlines();
        if(!this.currentChar == '"') throw new Error(this.ERRORS.unexpectedSyntax + this.showContext(this.col));

        var txt = '';
        this.advanceNoNewlines();

        while(this.currentChar != '"') {
            txt += this.currentChar;
            this.advanceNoNewlines();
        }

        try {
            txt = eval(txt)
        } catch (err) {}

        return txt;

    }

    showContext(idxStart, idxEnd) {

        idxStart = idxStart ?? 0;
        idxEnd = idxEnd ?? idxStart;

        let txt = '';
        txt += '\n';
        txt += this.content[this.ln].join('');
        txt += '\n';
        for(let i = 0; i < idxStart-1; i++) txt += ' ';
        for(let i = 0; i <= idxEnd - idxStart; i++) txt += '^';

        return txt;
    }

}

module.exports = Lexer;
