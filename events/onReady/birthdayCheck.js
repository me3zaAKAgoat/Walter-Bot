const Birthday = require("../../models/birthday");
const Channel = require("../../models/channel");
const roleUtils = require("../../utils/roleUtils");

const cleanupBirthdayRole = (currentGuild, birthdayRole) => {
	const today = new Date();
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0, 0, 0, 0);
	const timeToCleanup = tomorrow.getTime() - today.getTime();

	setTimeout(async () => {
		try {
			const birthdays = await Birthday.find({
				day: today.getDate(),
				month: today.getMonth() + 1,
			});
			for (const birthday of birthdays) {
				const member = currentGuild.members.cache.get(birthday.userId);
				if (!member) continue;
				if (member.roles.cache.has(birthdayRole.id)) {
					await member.roles.remove(birthdayRole);
				}
			}
		} catch (err) {
			console.error("couldn't remvoe members from happy birthday role", err);
		}
	}, timeToCleanup);
};

const birthdayMessage = (userId) =>
	`@everyone Today is <@${userId}>'s birthday 🥳, don't forget to wish them a happy birthday <a:miyanoHype:1069612575416922112>, and as always our age is merely the number of years the world has been enjoying us! :D`;

/* need to change this so that all guilds the bot is in get the announcement */
module.exports = {
	execute: async (client) => {
		let birthdays;
		let member;
		const currentDay = new Date().getDate();
		const currentMonth = new Date().getMonth() + 1;

		try {
			birthdays = await Birthday.find({
				day: currentDay,
				month: currentMonth,
			});

			for (const guild of client.guilds.cache) {
				const announcementChannelId = (
					await Channel.findOne({ channel: "birthday", guildId: guild.id })
				).channelId;
				const announcementChannel = client.channels.cache.get(
					announcementChannelId
				);
				const birthdayRole = guild.roles.cache.find(
					(role) => role.name.toLowerCase() === "birthday"
				);

				for (const birthday of birthdays) {
					member = guild.members.cache.get(birthday.userId);
					if (!member) continue;
					announcementChannel.send(birthdayMessage(member.id));
					const roleToBeHoisted = roleUtils.assignRole(
						member,
						birthdayRole,
						"birthday",
						[255, 226, 59]
					);
					if (!roleToBeHoisted.hoist) await roleToBeHoisted.setHoist(true);
				}

				/* cleanup to remove members once the day has ended */

				cleanupBirthdayRole(guild, birthdayRole);
			}
		} catch (err) {
			console.error(err);
			return;
		}
	},
};
