const nextConnect = require('next-connect');
const { sequelize, dbInitialized } = require('../../utils/database');

const handler = nextConnect();

handler.use(async (req, res, next) => {
  await dbInitialized;
  next();
});

handler.get(async (req, res) => {
  try {
    const { Video } = sequelize.models;

    if (!Video) {
      throw new Error('Video model is not initialized.');
    }

    const videos = await Video.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Error fetching videos.' });
  }
});

export default handler;