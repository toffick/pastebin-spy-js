const { parseString } = require('xml2js');

/**
 * async parse xml to js
 * @param {String} xml
 * @return {Promise<Object>}
 */
exports.xmlToJsAsync = async (xml) => {
	const raw = `<root>${xml}</root>`;

	return new Promise((res, rej) => {
		parseString(raw, { explicitArray: false, explicitRoot : false }, (err, result) => {
			if (err) return rej(err);

			return res(result);
		});
	})
}
