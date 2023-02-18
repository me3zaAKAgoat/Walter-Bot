require("dotenv").config();
const cron = require("cron");
const birthdayCheck = require("./onReady/birthdayCheck");
const birthdayCleanup = require("./onReady/birthdayCleanup");

const setupCronJobs = (client) => {
	const scheduledBirthdayCheck = new cron.CronJob("00 00 * * *", () => {
		birthdayCheck.execute(client);
	});
	const scheduledBirthdayCleanup = new cron.CronJob("00 00 * * *", () => {
		birthdayCleanup.execute(client);
	});

	scheduledBirthdayCheck.start();
	scheduledBirthdayCleanup.start();
};

module.exports = {
	name: "ready",
	once: true,
	execute: async (client) => {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.user.setPresence({
			activities: [{ name: "netflix with your mom", type: 3 }],
			status: "idle",
		});
		setupCronJobs(client);
	},
};
