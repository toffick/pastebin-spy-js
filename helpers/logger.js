class Logger {
	constructor(module){
		this.module = module;
	}

	/**
	 *
	 * @param {String} method
	 * @param {Array<String>} message
	 */
	error(method, ...message){
		console.log(`ERROR: ${this.module} -> ${method} -> ${message.join(' ')}`)
	}

	/**
	 *
	 * @param {String} method
	 * @param {Array<String>} message
	 */
	warn(method, ...message){
		console.log(`WARN: ${this.module} -> ${method} -> ${message.join(' ')}`)
	}

	/**
	 *
	 * @param {Array<String>} message
	 */
	log(...message){
		console.log(`INFO: ${message.join(' ')}`)
	}
}

module.exports = Logger;
