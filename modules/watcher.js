const PastebinApi = require('./pastebin.api');
const _ = require('lodash');
const Queue = require('better-queue');

class Watcher {
	constructor(_db) {
		this.db = _db;
		this.api = new PastebinApi();

		this.queue = null;
		this.timer = null;

		this.pasteIds = [];
		this.trendsTimeout = 10000;
	}

	/**
	 * start watching
	 */
	async init() {
		this._queueInit();

		this.timer = setInterval(async () => {
			const newPastesIds = await this.api.getPastesList();

			const diffIds = _.difference(newPastesIds, this.pasteIds);

			this.pasteIds = newPastesIds;

			diffIds.forEach(item => this.queue.push(item));

		}, this.trendsTimeout);

	}

	/**
	 * init queue handler
	 * @private
	 */
	_queueInit() {
		this.queue = new Queue(this._queueHandler.bind(this), { afterProcessDelay: 3000 });
		this.queue
			.on('task_finish', (taskId, result, stats) => {
				const { content, entryId } = result;

				this.db.Entry.create({ content, entryId })
					.then(result => {
					})
					.catch(err => {
					})
			})
			.on('task_failed', (taskId, err, stats) => {

			})
	}

	/**
	 *
	 * @param {String} input
	 * @param {Function} cb
	 * @private
	 */
	_queueHandler(input, cb) {
		this.api.getRawPaste(input)
			.then(content => cb(null, { content, entryId: input.slice(1) }))
			.catch(err => cb(err));
	}

	/**
	 * stop watching
	 */
	stop() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}

}

module.exports = Watcher;
