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
  const { id } = req.query;
  try {
    const video = await Video.findByPk(id);
    if (video) {
      res.status(200).json({
        id: video.id,
        title: video.title,
        description: video.description,
        category: video.category,
        privacy: video.privacy,
        duration: video.duration,
        createdAt: video.createdAt,
        thumbnail: `/uploads/${video.thumbnail}`,
        filename: `/uploads/${video.filename}`,
      });
    } else {
      res.status(404).json({ error: 'Video not found' });
    }
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Error fetching video' });
  }
});

export default handler;