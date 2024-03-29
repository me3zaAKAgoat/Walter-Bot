require("dotenv").config();
const fs = require("node:fs");
const { REST, Routes } = require("discord.js");
const logger = require("./utils/logger");
const [clientId, token] = [process.env.CLIENT_ID, process.env.DISCORD_TOKEN];

const commands = [];

const commandsPath = "./commands";
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = `${commandsPath}/${file}`;
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

rest
	.put(Routes.applicationCommands(clientId), { body: commands })
	.then((data) =>
		console.log(`Successfully registered ${data.length} application commands.`)
	)
	.catch((err) => logger.error(err));

// need to deploy this
