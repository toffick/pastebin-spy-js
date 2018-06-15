const Watcher = require('./modules/watcher');
const db = require('./db/db')();

(async () => {
	await db.sequelize.sync();
	const watcherInstance = new Watcher(db);

	await watcherInstance.init();
})();


// var PastebinAPI = require('pastebin-js'),
// 	pastebin = new PastebinAPI({
// 		'api_dev_key' : '93a816224f10c875821183b5406b599c',
// 		'api_user_name' : 'toffick',
// 		'api_user_password' : '178084Borsukm'
// 	});

// pastebin.listTrendingPastes().then(e=>console.log(e))
