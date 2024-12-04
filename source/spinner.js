const ora = require('ora');
const chalk = require('chalk');

class LoadingSpinner {
	constructor() {
		this.spinner = ora({
			text: 'Loading...',
			spinner: 'line',
			color: 'yellow',
			hideCursor: false,
			discardStdin: false,
		});
		this.startTime = null;
		this.timerInterval = null;
	}

	start() {
		process.stdout.write('\u001B7');

		this.startTime = Date.now();
		this.spinner.start();

		this.timerInterval = setInterval(() => {
			const elapsedMs = Date.now() - this.startTime;
			const seconds = Math.floor((elapsedMs / 1000) % 60)
				.toString()
				.padStart(2, '0');
			const minutes = Math.floor(elapsedMs / 1000 / 60)
				.toString()
				.padStart(2, '0');

			this.spinner.text = chalk.yellow(`${minutes}:${seconds} Loading...`);
		}, 100);
	}

	stop() {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
			this.timerInterval = null;
		}

		const elapsedMs = Date.now() - this.startTime;
		const seconds = Math.floor((elapsedMs / 1000) % 60)
			.toString()
			.padStart(2, '0');
		const minutes = Math.floor(elapsedMs / 1000 / 60)
			.toString()
			.padStart(2, '0');

		this.spinner.stop();

		process.stdout.write('\u001B8\u001B[K');

		console.log(chalk.green(`Response received in ${minutes}:${seconds}`));

		return new Promise((resolve) => setTimeout(resolve, 10));
	}

	async fail(error) {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
			this.timerInterval = null;
		}

		const elapsedMs = Date.now() - this.startTime;
		const seconds = Math.floor((elapsedMs / 1000) % 60)
			.toString()
			.padStart(2, '0');
		const minutes = Math.floor(elapsedMs / 1000 / 60)
			.toString()
			.padStart(2, '0');

		this.spinner.stop();

		process.stdout.write('\u001B8\u001B[K');

		console.log(chalk.red(`Error after ${minutes}:${seconds}: ${error}`));

		await new Promise((resolve) => setTimeout(resolve, 10));
	}
}

module.exports = LoadingSpinner;
