## **About**
Discord Embed Markup Langage is a compiled markup langage inspired by html used to create embeds for discord.js

## **Installation**
```
npm install `npm i discord_embed_markup_language`
```
## **Quickstart**
```js
const deml = require('discord_embed_markup_language');

var embed = deml.load('absolut/path/file.deml');
embed.format({
	myVar : "Any kind of javascript data", //You can put as much variables you want 
});

channel.send(embed.build());
```

You can find a deml file exemple [here](https://github.com/Comdec35000/Discord-Embed-Builder/blob/master/exemple/exemple.deml)
