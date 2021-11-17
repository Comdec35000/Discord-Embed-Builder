
const deml = require('discord_embed_markup_language');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents : [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
]});



const embed = deml.load( __dirname + "/exemple.deml" )
    .format({
        my_variable : "My variable content",
        color : "5865F2"
    })
    .create();

client.login('token');

client.on('messageCreate', message => {
    if(message.content === '!a') return message.channel.send(embed);
});


