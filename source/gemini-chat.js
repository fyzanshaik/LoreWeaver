const { GoogleGenerativeAI } = require('@google/generative-ai');
const readline = require('readline');
const fs = require('fs').promises;
const chalk = require('chalk');
const LoadingSpinner = require('./spinner');
const { logger, saveChat } = require('./utils');
const CONFIG = require('./config');

class GeminiChatInterface {
	constructor(apiKey) {
		if (!apiKey) {
			throw new Error('API key is required. Please set it in your .env file or pass it as an argument.');
		}

		this.genAI = new GoogleGenerativeAI(apiKey);
		this.model = this.genAI.getGenerativeModel({
			model: CONFIG.DEFAULT_MODEL,
			generationConfig: {
				temperature: CONFIG.TEMPERATURE,
				maxOutputTokens: CONFIG.MAX_OUTPUT_TOKENS,
			},
		});

		this.chat = null;
		this.context = '';
		this.chatHistory = [];
	}

	async loadContextFile(filePath) {
		try {
			this.context = await fs.readFile(filePath, 'utf8');
			logger.info(`Successfully loaded context from ${filePath}`);

			const systemMessage = `Context Information:
            ${this.context}
            
            Instructions:
            1. Use this context to answer questions
            2. If a question can't be answered using the context, say so
            3. You can refer to other relevant knowledge when appropriate
            
            Please confirm you've received this context by summarizing its main points.`;

			this.chat = this.model.startChat({
				history: [
					{
						role: 'user',
						parts: [{ text: systemMessage }],
					},
				],
			});

			const initialResponse = await this.chat.sendMessage(systemMessage);
			this.chatHistory.push({ role: 'user', parts: [{ text: systemMessage }] }, { role: 'assistant', parts: [{ text: initialResponse.response.text() }] });

			return initialResponse.response.text();
		} catch (error) {
			throw new Error(`Error loading context file: ${error.message}`);
		}
	}
	//TODO : ADD SPINNER FOR GOOD UI LOOK
	// async sendMessage(message) {
	// 	try {
	// 		const result = await this.chat.sendMessage(message);
	// 		const response = result.response.text();

	// 		this.chatHistory.push({ role: 'user', parts: [{ text: message }] }, { role: 'assistant', parts: [{ text: response }] });

	// 		if (this.chatHistory.length > CONFIG.MAX_HISTORY_LENGTH) {
	// 			this.chatHistory = this.chatHistory.slice(-CONFIG.MAX_HISTORY_LENGTH);
	// 		}

	// 		return response;
	// 	} catch (error) {
	// 		throw new Error(`Error sending message: ${error.message}`);
	// 	}
	// }

	//Added SPINNER
	async sendMessage(message) {
		const spinner = new LoadingSpinner();
		try {
			spinner.start();
			const result = await this.chat.sendMessage(message);
			const response = result.response.text();

			await spinner.stop();

			this.chatHistory.push({ role: 'user', parts: [{ text: message }] }, { role: 'assistant', parts: [{ text: response }] });

			return response;
		} catch (error) {
			await spinner.fail(error.message);
			throw new Error(`Error sending message: ${error.message}`);
		}
	}
	createInterface() {
		return readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			// prompt: chalk.green('You: '),
		});
	}

	async startInteractiveChat() {
		const rl = this.createInterface();
		let chatStartTime = new Date();

		logger.info('Welcome to Enhanced Gemini Chat Interface!');
		logger.info('Commands:');
		logger.info('/save - Save chat history');
		logger.info('/clear - Clear chat history');
		logger.info('/context - Show loaded context');
		logger.info('/help - Show commands');
		logger.info('/exit - Exit chat');
		logger.info('');

		const askQuestion = () => {
			return new Promise((resolve) => {
				rl.question(chalk.green('You: '), resolve);
			});
		};

		try {
			while (true) {
				const userInput = await askQuestion();
				const command = userInput.toLowerCase();

				if (command.startsWith('/')) {
					switch (command) {
						case '/save':
							const filename = `../chat-logs/chat_log_${new Date().toISOString()}.txt`;
							await saveChat(this.chatHistory, filename);
							logger.info(`Chat saved to ${filename}`);
							continue;

						case '/clear':
							this.chatHistory = [];
							logger.info('Chat history cleared');
							continue;

						case '/context':
							logger.info('Current Context:');
							console.log(this.context);
							continue;

						case '/help':
							logger.info('Available Commands:');
							logger.info('/save - Save chat history');
							logger.info('/clear - Clear chat history');
							logger.info('/context - Show loaded context');
							logger.info('/help - Show commands');
							logger.info('/exit - Exit chat');
							continue;

						case '/exit':
							const duration = Math.round((new Date() - chatStartTime) / 1000);
							logger.info(`Chat session ended. Duration: ${duration} seconds`);
							logger.info(`Messages exchanged: ${this.chatHistory.length}`);
							rl.close();
							return;
					}
				}

				logger.thinking();

				try {
					const response = await this.sendMessage(userInput);
					console.log();
					logger.ai(response + '\n');
					process.stdout.write('\r\x1b[K');
				} catch (error) {
					logger.error('Error getting response: ' + error.message + '\n');
				}
			}
		} catch (error) {
			logger.error('An error occurred: ' + error.message);
			rl.close();
		}
	}
}

module.exports = GeminiChatInterface;
