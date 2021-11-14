
const { MessageEmbed } = require('discord.js');


class Compiler {

    constructor(data, base) {
        this.base = base;
        this.data = data;
        this.embeds = [];
    }

    compil() {
        this.data.content.forEach((embed) => this.buildEmbed(embed));

        return { embeds: [...this.embeds] };
    }

    buildEmbed(embedData) {

        var embed = new MessageEmbed();

        embed.setColor(embedData.meta.color ?? '2f3136')
        embed.setURL(embedData.meta.url);
        if(embedData.meta.timestamp) embed.setTimestamp(embedData.meta.timestamp);

        embed.setDescription(embedData.text ?? '');

        for(const key in embedData.content) {

            var element = embedData.content[key];

            switch(element.type) {
    
                case 'title' :
                    embed.setTitle(element.text);
                    break;
                
                case 'div' :
                    embed.addField(
                        element.args.title ?? '',
                        element.text ?? ''
                    );
                    break;
                
                case 'span' :
                    embed.addField(
                        element.args.title ?? '',
                        element.text ?? '',
                        true
                    );
                    break;
                
                case 'img' :
                    embed.setImage(element.args.url ?? '');
                    break;

                case 'thumb' :
                    embed.setThumbnail(element.args.url ?? '');
                    break;

                case 'footer' :
                    embed.setFooter(element.text, element.args.url ?? '');
                    break;
                
                case 'author' :
                    embed.setAuthor(element.text, element.args.url ?? '', element.args.ref ?? '');
                    break;

                case 'meta' :
                    break;

                default :
                    throw new Error('Unrecognize tag type : ' + element.type);
            }
        }

        return this.embeds.push(embed);

    }
    
}

module.exports = Compiler;
