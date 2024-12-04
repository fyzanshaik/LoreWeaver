require('dotenv').config();
const { logger, createDirectory } = require('./source/utils');
const GeminiChatInterface = require('./source/gemini-chat');

async function main() {
	try {
		const apiKey = process.env.GEMINI_API_KEY;
		const chatInterface = new GeminiChatInterface(apiKey);
		createDirectory('./chat-logs');
		logger.info('Loading context from file...');
		const initialResponse = await chatInterface.loadContextFile(process.env.CONTEXT_FILE || 'data.txt');
		logger.ai(initialResponse + '\n');

		await chatInterface.startInteractiveChat();
	} catch (error) {
		logger.error('Fatal error: ' + error.message);
		process.exit(1);
	}
}

if (require.main === module) {
	main();
}
