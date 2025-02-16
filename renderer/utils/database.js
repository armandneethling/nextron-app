const { Sequelize } = require('sequelize');
const path = require('path');

// Update the path to your new database location
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve('database.sqlite'),
  logging: console.log,
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = {
  sequelize,
  dbInitialized: initializeDatabase(),
};
