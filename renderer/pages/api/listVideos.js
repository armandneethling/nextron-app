import nextConnect from 'next-connect';
import { sequelize, dbInitialized } from '../../utils/database';
import defineVideoModel from '../../models/Video';

const Video = defineVideoModel(sequelize);

const handler = nextConnect();

handler.use(async (req, res, next) => {
  await dbInitialized;
  next();
});

handler.get(async (req, res) => {
  try {
    const videos = await Video.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Error fetching videos.' });
  }
});

export default handler;
