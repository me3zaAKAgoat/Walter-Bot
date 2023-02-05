// Require the necessary discord.js classes
require("dotenv").config();
const fs = require("node:fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
const token = process.env.DISCORD_TOKEN;

console.log("connecting to MongoDB");

mongoose
	.connect(process.env.MONGODB_URI)
	.then(console.log("connected to db"))
	.catch((error) => console.error("coudlnt connect to db", error));
// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildPresences,
	],
});

const eventsPath = "./events";
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = `${eventsPath}/${file}`;
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();

const commandsPath = "./commands";
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const filePath = `${commandsPath}/${file}`;
	const command = require(filePath);

	client.commands.set(command.data.name, command);
}

// Login to Discord with your client's token
client.login(token);
