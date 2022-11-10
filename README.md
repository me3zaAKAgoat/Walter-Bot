<h1 align="center"><strong>Akatsuki's Members Own Bot</strong></h1>

This bot was created by me3za and is meant to serve some of the casual needs of the akatsuki server members. it is also worth noting that this bot is an expiremental/for-fun bot.

## **Services Provided**

The bot offers multiple services such as:

- Show a meme for every distinct member.
- Welcome and farewell messages and walk new members through getting their roles.
	- Ask new members for an introduction.
- Member management and server administartion services.
	- Give all members an explicit member role.
	- Reaction Roles.
- Have a system to set each persons individual color.
- Make a polling system.
- Checking the League of legends/Valorant elo of the specified users.
- Have a database of watched movies and their reviews based on server member reaction.
- Do member statistics.
- Avatar command.
- meme templates commands.
- `need twitter api key`
	- Make a news feed channel that has:
		- Anime notifications from twitter accounts such as: [crunchyroll](https://twitter.com/Crunchyroll).
	- VCT/LEC/WORLDS/MSI playoffs announcements.
	- Get the results of pro games **LCS LEC WORLDS** of the day with slash command.
- bot makes its own role to get its own special color using the code below though it still needs tweaks.
```js
module.exports = {
	name: 'guildCreate',
	once: false,
	execute : async (guild) => {
		try {
			let role = await guild.roles.create({
				data: {
					name: 'Walter',
					color: "#000000"
				}
			});
			guild.member(guild.client.user).roles.add(role);
		} catch(err)
		{
			console.log(err)
		}
		return ;
}}
```
# Feature tweaks:
- make reviews editable
- make movie names auto complete
- gate how many unreviewed movies a user can input


