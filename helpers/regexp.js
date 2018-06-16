/**
 *
 * @type {Array<RegExp>}
 */
module.exports = [
	{
		regexp: /api(key|secret)/mi,
		type: 'apikey'
	},
	{
		regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/mi,
		type: 'email'
	}
];
