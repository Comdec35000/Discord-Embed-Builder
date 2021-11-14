
const { MessageEmbed } = require('discord.js');


class Compiler {

    constructor(data) {
        this.data = data;
        this.embeds = [];
    }

    compil() {
        this.data.content.forEach(this.buildEmbed);

        return { embeds: this.embeds };
    }

    buildEmbed(embedData) {

        var embed = new MessageEmbed();

        embed.setColor(embedData.meta.color ?? '2f3136')
        embed.setURL(embedData.meta.url);
        embed.setTimestamp(embedData.meta.setTimestamp);

        embed.setDescription(embedData.text);

        embedData.content.forEach(element => {
            switch(element.type) {
                case 'title' :
                    embed.setTitle(element.text);
                    break;

                default :
                    throw new Error('Unrecognize tag type : ' + element.type);
            }
        });

        this.embeds.push(embed);

    }
    
}

module.exports = Compiler;
