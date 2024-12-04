require('dotenv').config();

const CONFIG = {
	DEFAULT_MODEL: 'gemini-1.5-flash',
	MAX_HISTORY_LENGTH: 50,
	TEMPERATURE: 0.7,
	MAX_OUTPUT_TOKENS: 2048,
	STYLES: {
		PREFIX: {
			USER: '🧑',
			AI: '🤖',
			SYSTEM: '⚙️',
			ERROR: '❌',
		},
	},
};

module.exports = CONFIG;
