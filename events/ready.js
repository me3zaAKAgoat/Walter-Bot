require("dotenv").config();
const cron = require("cron");
const birthdayCheck = require("./handlers/birthdayCheck");
const birthdayCleanup = require("./handlers/birthdayCleanup");
const downtimeCorrection = require("./handlers/downtimeCorrection");

const setupCronJobs = (client) => {
	const birthdayCheckCron = new cron.CronJob("00 00 * * *", () => {
		birthdayCheck.execute(client);
	});

	const birthdayCleanupCron = new cron.CronJob("00 00 * * *", () => {
		birthdayCleanup.execute(client);
	});

	birthdayCheckCron.start();
	birthdayCleanupCron.start();
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
		downtimeCorrection.execute(client);
	},
};
