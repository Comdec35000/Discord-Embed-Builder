
class Token {

    static types = {
        TAG_OPEN : "TAG_OPEN_TOKEN",
        TAG_CLOSE : "TAG_CLOSE_TOKEN",
        BLOCK_TAG : "BLOCK_TAG_TOKEN",
        CONTENT: "CONTENT_TOKEN"
    }

    constructor(type, content, start, end) {
        this.type = type;
        this.content = content ?? {};
        this.start = start ?? 0;
        this.end = end ?? 0;
    }
    
}

module.exports = Token;
