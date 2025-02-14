const nano = require('nano')('http://admin:admin@couchdb:5984'); 
// Replace with your CouchDB credentials if needed

// Connect to both databases
const userDb = nano.db.use('taskmanager_user');
const taskDb = nano.db.use('taskmanager_task');

module.exports = { userDb, taskDb };
