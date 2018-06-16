class Logger {
	constructor(module) {
		this.module = module;
	}

	/**
	 *
	 * @param {String} method
	 * @param {String} message
	 */
	error(method, ...message) {
		console.log(new Date, `ERROR: ${this.module} -> ${method} -> ${message.join(' ')}`)
	}

	/**
	 *
	 * @param {String} method
	 * @param {String} message
	 */
	warn(method, ...message) {
		console.log(new Date, `WARN: ${this.module} -> ${method} -> ${message.join(' ')}`)
	}

	/**
	 *
	 * @param {String} message
	 */
	log(...message) {
		console.log(new Date, `INFO: ${message.join(' ')}`)
	}
}

module.exports = Logger;
