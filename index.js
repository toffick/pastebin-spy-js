const Watcher = require('./modules/watcher');
const db = require('./db/db')();

(async () => {
	await db.sequelize.sync();
	const watcherInstance = new Watcher(db);

	watcherInstance.init();
	await watcherInstance.start();
})();
