const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(process.cwd(), 'database.sqlite'),
  logging: console.log,
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const defineVideoModel = (await import('../models/Video')).default;
    defineVideoModel(sequelize);

    await sequelize.sync();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const dbInitialized = initializeDatabase();

module.exports = {
  sequelize,
  dbInitialized,
};