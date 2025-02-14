const sequelize = require('../../database');
const Video = require('../../models/Video');

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = initializeDatabase;
