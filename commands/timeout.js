const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
/*
make an embed denouncing ;
"vote if X should to be timed out for Y minutes"
collect 3 more votes and then apply timeout 
send death note gif and then timeout
*/

module.exports = {
	data: new SlashCommandBuilder()
		.setName('death')
		.setDescription('timeout member Y for X amount of minutes')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('note')
				.setDescription(
					'reaction vote to timeout member for X amount of minutes'
				)
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
				)
		),
	execute: async (interaction) => {
		try {
			await interaction.deferReply();

			const image = new AttachmentBuilder('./commands/content/death-note.gif');
			const user = interaction.options.getUser('user');
			const length = interaction.options.getString('length');
			const member = interaction.guild.members.cache.get(user.id);
			const quota = 3 + 1; /* + 1 is offset for the bot own reaction */

			/* I dont know why but whenever a member does not have administrator an exception is thrown
			 instead of giving false so i did some spaghetti */
			let isAdmin;
			try {
				isAdmin = member.permissions.has('ADMINISTRATOR');
			} catch {
				isAdmin = false;
			}

			if (isAdmin)
				return await interaction.editReply({
					content: '**🚫 This user is admin thus cant be timed out.**',
				});
			const message = await interaction.editReply({
				content: `Do you agree that user <@${user.id}> should be timed out for ${length} minutes, 4 votes total needed.`,
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
					member.timeout(Number(length) * 60 * 1000);
					return interaction.editReply({
						content: 'https://media.tenor.com/9C-wnbKI-IQAAAAd/death-note.gif',
					});
					// return interaction.editReply({
					// 	content: null,
					// 	files: [image],
					// });
				}
			});
		} catch (err) {
			console.log(err);
		}
	},
};
