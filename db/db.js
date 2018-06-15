const config = require('config');
const entry = require('./entry.model');
const Sequelize = require('sequelize');

/**
 *
 * @return {{Entry: *, sequelize: Sequelize, Sequelize: Sequelize}}
 */
module.exports = () => {
	const sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, config.db.options);

	const Entry = entry(Sequelize, sequelize);

	return {
		Entry,
		sequelize,
		Sequelize
	};
};
