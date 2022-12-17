const { SlashCommandBuilder } = require('discord.js');
/*
make an embed denouncing ;
"vote if X should to be timed out for Y minutes"
collect 3 more votes and then apply timeout 
send death note gif and then timeout
*/

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('timeout member for X amount of minutes')
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('the user to timeout')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('length')
				.setDescription('length of timeout')
				.setRequired(true)
				.addChoices(
					{ name: '1 minute', value: '1' },
					{ name: '5 minutes', value: '5' },
					{ name: '10 minutes', value: '10' },
					{ name: '1 day', value: '1440' }
				)
		),
	execute: async (interaction) => {
		try {
			const user = interaction.options.getUser('user');
			const length = interaction.options.getString('length');
			const quota = 3 + 1; /* the + 1 is offset for the bot */

			await interaction.deferReply();
			const message = await interaction.editReply({
				content: `Do you agree that user <@${user.id}> should be timed out for ${length} minutes`,
				fetchReply: true,
			});

			message.react('🤝');
			const filter = (reaction, user) => {
				reaction.emoji.name === '🤝';
			};
			const collector = message.createReactionCollector(filter, {
				time: 60 * 1000,
			});
			collector.on('collect', (reaction) => {
				if (reaction.count >= quota) {
					interaction.editReply({
						content: 'https://tenor.com/view/death-note-gif-25596232',
					});
					const member = interaction.guild.members.cache.get(user.id);
					member.timeout(Number(length) * 60 * 1000);
				}
			});
		} catch (err) {
			console.log(err);
		}
	},
};
