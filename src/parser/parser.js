const Token = require("../lexer/token");

class Parser {
    constructor(tokens) {
        this.tokens = tokens;

        this.pos = -1;

        this.content = {
            content : []
        };
        this.advance();

    }

    advance() {
        this.pos++;
        this.currentTok = this.tokens[this.pos];
    }

    parse() {

        while(this.currentTok) {
            this.buildTag(this.content);
            this.advance()
        }

        return this.content;

    }

    buildTag(content, tagEnd) {                 
        if(this.currentTok.type === Token.types.BLOCK_TAG) {
            if(this.currentTok.content.tagType == 'meta') {

                for(const key in this.currentTok.content.args) {
                    content['meta'][key] = this.currentTok.content.args[key];
                }

            } else {
                content.content.push({
                    type : this.currentTok.content.tagType,
                    args : this.currentTok.content.args
                });
            }

        } else if(this.currentTok.type === Token.types.TAG_OPEN) {

            var tagContent = {
                type : this.currentTok.content.tagType,
                args : this.currentTok.content.args,
                meta : [],
                content : [],
                text : ''
            }

            this.advance();
            this.buildTag(tagContent, tagContent.type);

            content.content.push(tagContent);
        } else if(this.currentTok.type === Token.types.CONTENT) {
            content.text += `\n${this.currentTok.content}`;
        } else if(this.currentTok.type === Token.types.TAG_CLOSE) {
            if(!this.currentTok.content.tegType === tagEnd) throw new Error("Unexpected tag end : " + this.currentTok);
            return;
        }

        if(!(this.currentTok.type === Token.types.TAG_CLOSE && this.currentTok.content.tegType === tagEnd)) {
            this.advance(); 
            this.buildTag(content, tagEnd);
        }

    }
}

module.exports = Parser;
