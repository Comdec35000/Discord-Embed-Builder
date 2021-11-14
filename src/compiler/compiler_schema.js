const Token = require("../lexer/token");

module.exports.compilerSchema = [

    {
        name: 'meta',
        block: true,
        build: function(element, embed) {
            return
        }
    },

    {
        name: 'title',
        block: false,
        build: function(element, embed) {
            return embed.setTitle(element.text);
        }
    },

    {
        name: 'div',
        block: false,
        build: function(element, embed) {
            return embed.addField(
                element.args.title ?? '',
                element.text ?? ''
            );
        }
    },

    {
        name: 'span',
        block: false,
        build: function(element, embed) {
            return embed.addField(
                element.args.title ?? '',
                element.text ?? '',
                true
            );
        }
    },

    {
        name: 'img',
        block: true,
        build: function(element, embed) {
            return embed.setImage(element.args.url ?? '');
        }
    },

    {
        name: 'thumb',
        block: true,
        build: function(element, embed) {
            return embed.setThumbnail(element.args.url ?? '');
        }
    },

    {
        name: 'footer',
        block: false,
        build: function(element, embed) {
            return embed.setFooter(element.text, element.args.url ?? '');
        }
    },

    {
        name: 'author',
        block: false,
        build: function(element, embed) {
            return embed.setAuthor(element.text, element.args.url ?? '', element.args.ref ?? '');
        }
    }
]