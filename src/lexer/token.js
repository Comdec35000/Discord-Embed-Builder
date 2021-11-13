
class Token {

    static types = {
        TAG_OPEN : "TAG_OPEN_TOKEN",
        TAG_CLOSE : "TAG_CLOSE_TOKEN",
        BLOCK_TAG : "BLOCK_TAG_TOKEN",
        CONTENT: "CONTENT_TOKEN"
    }

    constructor(type, content) {
        this.type = type;
        this.content = content ?? {};
    }
    
}

module.exports = Token;
