const request = require('request-promise');
const CONFIG = require('config');
const Logger = require('../helpers/logger');
const cheerio = require('cheerio');

class PastebinApi {
	constructor() {
		this.logger = new Logger(this.constructor.name);

		this.pasteRawEndpoint = 'https://pastebin.com/raw';
		this.pasteListEndpoint = 'https://pastebin.com/archive';
	}

	/**
	 *
	 * @return {Promise<Array<String>>}
	 */
	async getPastesList() {
		const response = await request(this.pasteListEndpoint);

		return this._transformRawPastesToArray(response);
	}

	/**
	 *
	 * @param {String} raw
	 * @return {Array<String>}
	 * @private
	 */
	_transformRawPastesToArray(raw) {
		const $ = cheerio.load(raw);

		const childrenArray = $('tbody').children() || [];

		const ids = childrenArray.slice(1).map((index, item) => {
			try {
				return item.children[1].children[1].attribs.href;
			} catch (e) {
				return null;
			}
		});

		return ids;
	}

	/**
	 *
	 * @return {Promise<String>}
	 */
	async getRawPaste(id) {
		const response = await request({
				uri: `${this.pasteRawEndpoint}${id}`,
				method: 'GET'
			}
		);

		return response;
	}

}

module.exports = PastebinApi;
