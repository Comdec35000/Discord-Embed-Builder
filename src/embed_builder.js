
class EmbedBuilder {

    static content;
    static params;

    constructor(content) {
        this.content = content
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

        console.log(this.content);
    }

}

module.exports = EmbedBuilder;
