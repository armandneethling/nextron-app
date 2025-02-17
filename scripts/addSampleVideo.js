const { Sequelize } = require('sequelize');
const path = require('path');
const defineVideoModel = require('../models/Video');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(process.cwd(), 'database.sqlite'),
  logging: console.log,
});

async function addVideo() {
  const Video = defineVideoModel(sequelize);
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await sequelize.sync({ force: true });
    console.log('Database schema synchronized.');

    const newVideo = {
      id: 'unique-video-id',
      filename: 'sample.mp4',
      thumbnail: 'sample.jpg',
      title: 'Sample Video',
      description: 'This is a sample video',
      category: 'Tutorial',
      privacy: 'Public',
      duration: 120,
      createdAt: new Date(),
    };

    await Video.create(newVideo);
    console.log('Video entry has been added:', newVideo);
  } catch (error) {
    console.error('Error adding video:', error);
  } finally {
    await sequelize.close();
  }
}

addVideo();