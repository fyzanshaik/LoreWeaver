const fs = require('fs');
const chalk = require('chalk');
const CONFIG = require('./config');

const logger = {
	info: (msg) => console.log(chalk.blue(CONFIG.STYLES.PREFIX.SYSTEM + ' ' + msg)),
	success: (msg) => console.log(chalk.green(CONFIG.STYLES.PREFIX.USER + ' ' + msg)),
	error: (msg) => console.log(chalk.red(CONFIG.STYLES.PREFIX.ERROR + ' ' + msg)),
	ai: (msg) => console.log(chalk.magenta(CONFIG.STYLES.PREFIX.AI + ' ' + msg)),
	thinking: () => console.log(chalk.yellow('\n' + CONFIG.STYLES.PREFIX.AI + ' Thinking...\n')),
};

const saveChat = async (history, filename) => {
	const chatLog = history.map((msg) => `${msg.role}: ${msg.parts[0].text}`).join('\n\n');
	await fs.promises.writeFile(filename, chatLog, 'utf8');
};

function createDirectory(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
		console.log(`Directory created: ${dirPath}`);
	} else {
		console.log(`Directory already exists: ${dirPath}`);
	}
}

module.exports = { logger, saveChat, createDirectory };
