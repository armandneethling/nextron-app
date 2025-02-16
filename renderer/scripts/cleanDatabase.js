const { Sequelize } = require('sequelize');
const { resolve } = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: resolve(process.cwd(), 'database.sqlite'),
  logging: console.log,
});

const defineVideoModel = require('../models/Video');
const Video = defineVideoModel(sequelize);

async function cleanDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await Video.destroy({ where: {}, truncate: true });
    console.log('All video entries have been deleted.');
  } catch (error) {
    console.error('Error cleaning the database:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

cleanDatabase();

console.log('Database cleaned.');