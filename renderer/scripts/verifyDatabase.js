const { Sequelize } = require('sequelize');
const path = require('path');
const defineVideoModel = require('../models/Video');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve('database.sqlite'),
  logging: console.log,
});

async function verifyDatabase() {
  const Video = defineVideoModel(sequelize);
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const videoId = '';
    const video = await Video.findByPk(videoId);
    if (video) {
      console.log('Fetched video data:', video);
    } else {
      console.log('Video not found');
    }
  } catch (error) {
    console.error('Error verifying database:', error);
  } finally {
    await sequelize.close();
  }
}

verifyDatabase();