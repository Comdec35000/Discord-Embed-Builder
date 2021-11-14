
const { MessageEmbed } = require('discord.js');


class Compiler {

    constructor(data) {
        this.data = data;
        this.embeds = [];
    }

    compil() {
        console.log('bbb');
        this.data.content.forEach(this.buildEmbed);

        return { embeds: this.embeds };
    }

    buildEmbed(embedData) {
        console.log('ccc');

        var embed = new MessageEmbed();

        embed.setColor(embedData.meta.color ?? '2f3136')
        embed.setURL(embedData.meta.url);
        embed.setTimestamp(embedData.meta.setTimestamp);

        embed.setDescription(embedData.text);

        embedData.content.forEach(element => {

            console.log(element);

            switch(element.type) {
                case 'title' :
                    embed.setTitle(element.text);
                    break;

                default :
                    throw new Error('Unrecognize tag type : ' + element.type);
            }
        });

    }
    

}

module.exports = Compiler;
