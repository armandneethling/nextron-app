import nextConnect from 'next-connect';
import { sequelize } from '../../utils/database';
import defineVideoModel from '../../models/Video';
import defineReviewModel from '../../models/Review';
import defineReplyModel from '../../models/Reply';

const Video = defineVideoModel(sequelize);
const Review = defineReviewModel(sequelize);
const Reply = defineReplyModel(sequelize);

// Define associations
Video.hasMany(Review, { foreignKey: 'videoId', as: 'reviews' });
Review.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
Review.hasMany(Reply, { foreignKey: 'reviewId', as: 'replies' });
Reply.belongsTo(Review, { foreignKey: 'reviewId', as: 'review' });

const handler = nextConnect();

handler.delete(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Video ID is required.' });
  }

  try {
    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }

    await video.destroy();

    res.status(200).json({ message: 'Video deleted successfully.' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Error deleting video.' });
  }
});

export default handler;