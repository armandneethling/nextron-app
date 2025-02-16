const nextConnect = require('next-connect');
const { sequelize, dbInitialized } = require('../../utils/database');
const defineVideoModel = require('../../models/Video');
const Video = defineVideoModel(sequelize);

const handler = nextConnect();

handler.use(async (req, res, next) => {
  await dbInitialized;
  next();
});

handler.get(async (req, res) => {
  const { id } = req.query;
  console.log('Requested video ID:', id);

  try {
    const video = await Video.findByPk(id);
    console.log('Fetched video:', video);

    if (video) {
      res.status(200).json(video);
    } else {
      console.log('Video not found for ID:', id);
      res.status(404).json({ error: 'Video not found' });
    }
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Error fetching video' });
  }
});

module.exports = handler;
