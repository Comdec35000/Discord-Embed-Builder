
const { MessageEmbed } = require('discord.js');
const { compilerSchema } = require('./compiler_schema');


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

            compilerSchema.find(s => s.name === element.type).build(element, embed);
        }

        return this.embeds.push(embed);

    }
    
}

module.exports = Compiler;
