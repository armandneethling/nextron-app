import nextConnect from 'next-connect';
import { sequelize } from '../../utils/database';
import defineVideoModel from '../../models/Video';
import defineReviewModel from '../../models/Review';
import defineReplyModel from '../../models/Reply';

const Video = defineVideoModel(sequelize);
const Review = defineReviewModel(sequelize);
const Reply = defineReplyModel(sequelize);

Video.hasMany(Review, { foreignKey: 'videoId', as: 'reviews' });
Review.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
Review.hasMany(Reply, { foreignKey: 'reviewId', as: 'replies' });
Reply.belongsTo(Review, { foreignKey: 'reviewId', as: 'review' });

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: {
        model: Review,
        as: 'reviews',
        include: {
          model: Reply,
          as: 'replies',
        },
      },
    });
    res.status(200).json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Error fetching videos.' });
  }
});

export default handler;