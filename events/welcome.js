module.exports = {
	name: 'guildMemberAdd',
	once: false,
	execute : (member) => {
        const welcomeChannleId = '1039722968424648774';

        let memberRole = member.guild.roles.cache.find(role => role.name === 'Member');

        const welcomeChannel = member.guild.channels.cache.get(welcomeChannleId);

        member.roles.add(memberRole);
        
        welcomeChannel.send(`Hello ${member.displayName}\nwelcome to the ${member.guild.name} server :D\nfeel free to introduce us to who you are`)
	},
};