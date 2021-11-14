
const Token = require('./token.js');


class Lexer {

    variableChars = /[a-zA-Z0-9_]+/;

    ERRORS = {
        unexpectedSyntax : "DiscordEmbedBuilder.Error.UnexpectedSyntax : "
    }

    constructor(content) {

        if(content) {
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
        }

        this.ln = 0;
        this.col = -1;

        this.tokens = [];
        
    }

    advance() {
        let newline = false;

        this.col++;
        if(!(this.ln >= this.content.length) && !this.content[this.ln][this.col]) {
            this.col = 0;
            this.ln++;
            newline = true;
        }
        if(!(this.ln >= this.content.length)) this.currentChar = this.content[this.ln][this.col];
        if(!this.currentChar) this.advance();
        return newline;
    }

    advanceNoNewlines() {
        if(this.advance()) throw new Error(this.ERRORS.unexpectedSyntax + this.showContext(this.col));
    }

    goBack() {
        if(this.col <= 0) {
            this.ln --;
            this.col = this.content[this.ln].length - 1;
            return;
        }
        this.col --;
    }

    ignoreSpaces() {
        while((/[ \t]+/).test(this.currentChar)) {
            this.advance();
        }
    }

    lex() {

        while(this.content[this.ln]) {
            this.advance();

            if(!this.content[this.ln]) break;
            this.ignoreSpaces();

            if(this.currentChar === '<') {
                this.buildTag();
            } else {
                this.buildContent();
            }
        }

        return this.tokens;

    }

    buildTag(test) {

        let token = new Token();
        
        this.advanceNoNewlines();

        if(this.currentChar == '/') {
            token.type = Token.types.TAG_CLOSE;
            this.advanceNoNewlines();
        }

        let keyword = this.buildWord();
        token.content.tagType = keyword.toLowerCase();

        while(this.currentChar != '>') {
            this.advance();
            if(!this.currentChar) break;

            if(this.currentChar == '/') token.type = Token.types.BLOCK_TAG;

            if(this.variableChars.test(this.currentChar)){
                token.content.args = token.content.args ?? {};
                token.content.args[this.buildWord()] = this.buildArg();
            }

        }

        if(!token.type) token.type = Token.types.TAG_OPEN;
        if(test) return token;
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
        this.ignoreSpaces()
        if(!this.currentChar == '=') return;
        this.advanceNoNewlines();
        this.ignoreSpaces();
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

    buildContent() {

        var content = '';
        var run = true;

        while(run) {

            if(!this.currentChar) run = false;

            if(this.currentChar == '<') {
                let copy = this.copy();

                if(copy.buildTag(true)) {
                    this.goBack();
                    break;
                }
            }

            content += this.currentChar;
            if(this.advance()) content += '\n';

        }

        if((/^[ \t\r\n]+$/).test(content)) return;

        return this.tokens.push(new Token(Token.types.CONTENT, content));

    }

    copy() {
        return Object.assign(new Lexer(), {...this});
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
