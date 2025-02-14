const nano = require('nano')('http://jlpile:jl0106@localhost:5984'); 
// Replace with your CouchDB credentials if needed

// Database names
const databases = ['taskmanager_user', 'taskmanager_task'];

// Function to check and create databases if they don't exist
async function ensureDatabaseExists(dbName) {
  try {
    const dbList = await nano.db.list();
    if (!dbList.includes(dbName)) {
      await nano.db.create(dbName);
      console.log(`✅ Database '${dbName}' created.`);
    } else {
      console.log(`⚡ Database '${dbName}' already exists.`);
    }
  } catch (error) {
    console.error(`❌ Error ensuring database '${dbName}':`, error);
  }
}

// Ensure both databases exist
(async () => {
  await Promise.all(databases.map(ensureDatabaseExists));
})();

// Connect to the databases
const userDb = nano.db.use('taskmanager_user');
const taskDb = nano.db.use('taskmanager_task');

module.exports = { userDb, taskDb };
