const { Sequelize } = require('sequelize');
const { resolve } = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: resolve(process.cwd(), 'database.sqlite'),
  logging: console.log,
});

const defineVideoModel = require('../models/Video');
const defineUserModel = require('../models/User');

const Video = defineVideoModel(sequelize);
const User = defineUserModel(sequelize);

async function cleanDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await Video.destroy({ where: {}, truncate: true });
    console.log('All video entries have been deleted.');

    await User.destroy({ where: {}, truncate: true });
    console.log('All user entries have been deleted.');

    await sequelize.drop();
    await sequelize.sync();
    console.log('All tables have been dropped and recreated.');

  } catch (error) {
    console.error('Error cleaning the database:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

cleanDatabase();

console.log('Database cleaned.');
