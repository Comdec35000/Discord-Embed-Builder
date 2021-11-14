
const { compilerSchema } = require('../compiler/compiler_schema.js');
const { showContext } = require('../utis.js');
const Token = require('./token.js');


class Lexer {

    variableChars = /[a-zA-Z0-9_]+/;

    ERRORS = {
        unexpectedSyntax : "DiscordEmbedBuilder.Error.UnexpectedSyntax : ",
        unknowTag : "DiscordEmbedBuilder.Error.UnknowTag : "
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

    advanceIgnoreSpace() {
        let newline = false;

        this.col++;
        if(!(this.ln >= this.content.length) && !this.content[this.ln][this.col]) {
            this.col = 0;
            this.ln++;
            newline = true;
        }
        if(!(this.ln >= this.content.length)) this.currentChar = this.content[this.ln][this.col];
        return newline;
    }

    advanceNoNewlines() {
        if(this.advance()) throw new Error(this.ERRORS.unexpectedSyntax + showContext(this.col, this.col, this.ln, this.content));
    }

    advanceLine() {
        this.col = -1;
        this.ln++;
        if(!(this.ln >= this.content.length)) this.currentChar = this.content[this.ln][this.col];
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
            } else if(this.currentChar === '#') {
                let copy = this.copy();

                copy.advance();
                if(copy.currentChar == '#') {
                    this.advanceLine();
                } else {
                    this.buildContent();
                }
            } else {
                this.buildContent();
            }
        }

        return this.tokens;

    }

    buildTag(test) {

        let startPos = this.col;

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
        if(!compilerSchema.find(s => s.name === keyword)) throw new Error(this.ERRORS.unknowTag + keyword + showContext(startPos, this.col, this.ln, this.content));

        if((token.type != Token.types.TAG_CLOSE) && (token.type != (compilerSchema.find(s => s.name === keyword).block ? Token.types.BLOCK_TAG : Token.types.TAG_OPEN))) {
            throw new Error(this.ERRORS.unexpectedSyntax + showContext(startPos, this.col, this.ln, this.content));
        }

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
        if(!this.currentChar == '"') throw new Error(this.ERRORS.unexpectedSyntax + showContext(this.col, this.col, this.ln, this.content));

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

            if(this.currentChar == '#') {
                let copy = this.copy();

                copy.advance();
                if(copy.currentChar == '#') {
                    this.goBack();
                    break;
                }
    
            }

            content += this.currentChar;
            if(this.advanceIgnoreSpace()) content += '\n';
            while(!this.currentChar) {
                if(this.advanceIgnoreSpace()) content += '\n'
            };

        }

        if((/^[ \t\r\n]+$/).test(content)) return;

        return this.tokens.push(new Token(Token.types.CONTENT, content));

    }

    copy() {
        return Object.assign(new Lexer(), {...this});
    }

}

module.exports = Lexer;
