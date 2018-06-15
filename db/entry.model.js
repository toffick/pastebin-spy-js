module.exports = (Sequelize, sequelize) => {
	return sequelize.define('Entry', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		content: {type: Sequelize.TEXT('medium')},
		entryId: {type: Sequelize.STRING}
	});
};
