module.exports = {
	name: "guildMemberRemove",
	once: false,
	execute: (member) => {
		try {
			const welcomeChannleId = member.guild.systemChannelId;

			const welcomeChannel = member.guild.channels.cache.get(welcomeChannleId);

			welcomeChannel.send(`<@${member.id}> just left!`);
		} catch (err) {
			console.error(err);
		}
	},
};
