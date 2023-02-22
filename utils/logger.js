const fs = require("fs");
const path = require("path");
const util = require("util");

const logsDir = path.join(__dirname, "..", "logs");

if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir);
}

const createLogger = (level) => {
	const logStream = fs.createWriteStream(path.join(logsDir, `${level}.log`), {
		flags: "a",
	});

	return (...args) => {
		const message = util.format(...args);
		console.log(message);
		const formattedMessage = `[${level.toUpperCase()}] at ${new Date().toUTCString()}\n${new Error().stack
			.split("\n")[2]
			.trim()
			.match(/\((.*):\d+:\d+\)/)}\n${message}\n`;
		logStream.write(formattedMessage);
		logStream.end();
	};
};

const logger = {
	error: createLogger("error"),
	info: createLogger("info"),
	debug: createLogger("debug"),
};

module.exports = logger;
