const PastebinApi = require('./pastebin.api');
const _ = require('lodash');
const Queue = require('better-queue');
const Logger = require('../helpers/logger');
const regexpList = require('../helpers/regexp');

class Watcher {
	constructor(_db) {
		this.db = _db;
		this.api = new PastebinApi();
		this.logger = new Logger(this.constructor.name);

		this.queue = null;
		this.timer = null;

		this.pasteIds = [];
		this.trendsTimeout = 60 * 1000;
	}

	/**
	 * init module
	 */
	init() {
		this._queueInit();
	}

	/**
	 * init queue handler
	 * @private
	 */
	_queueInit() {
		this.queue = new Queue(this._queueHandler.bind(this), { afterProcessDelay: 3000 });
		this.queue
			.on('task_finish', (taskId, result, stats) => {
				if (result) {
					const { content, entryId, contentFlag } = result;

					this.db.Entry.create({ content, entryId, contentFlag })
						.then(res => {
							this.logger.log('task_finish', `${entryId} write to db with type ${contentFlag}`)
						})
						.catch(err => {
							this.logger.warn('task_finish', err)
						})
				}
			})
			.on('task_failed', (taskId, err, stats) => {
				this.logger.warn('task_failed', err)
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
			.then(content => {
				const { success, contentFlag } = this._searchProcess(content);

				if (success) {
					cb(null, { content, entryId: input.slice(1), contentFlag });
				} else {
					cb(null, null)
				}

			})
			.catch(err => cb(err));
	}

	/**
	 * search interesting pastes by regex
	 * @param {String} content
	 * @return {Object}
	 * @private
	 */
	_searchProcess(content) {
		for (let regExpObj of regexpList) {
			if (regExpObj.regexp.test(content)) {
				return { success: true, contentFlag: regExpObj.type };
			}
		}

		return { success: false };
	}

	/**
	 * start watching
	 */
	start() {
		this.queue.resume();

		this.timer = setInterval(async () => {
			try {
				const newPastesIds = await this.api.getPastesList();

				const diffIds = _.difference(newPastesIds, this.pasteIds);

				this.pasteIds = newPastesIds;

				diffIds.forEach(item => this.queue.push(item));


			} catch (e) {
				this.logger.error('process', e);

				if (e.statusCode === 403) {
					this.logger.warn('getPastesList', 'pastebin blocked script by ip. try to start watching after 30m ');

					this.stop();
					setTimeout(() => this.start(), 30 * 60 * 1000)
				}
			}
		}, this.trendsTimeout);

	}

	/**
	 * stop watching
	 * pause queue processing
	 * clear timer
	 */
	stop() {
		if (this.timer) {
			clearInterval(this.timer);
		}
		this.queue.pause();
	}

}

module.exports = Watcher;
