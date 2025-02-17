import nextConnect from 'next-connect';
import { sequelize } from '../../../utils/database';
import defineReviewModel from '../../../models/Review';
import defineReplyModel from '../../../models/Reply';
import defineVideoModel from '../../../models/Video';

const Video = defineVideoModel(sequelize);
const Review = defineReviewModel(sequelize);
const Reply = defineReplyModel(sequelize);

Video.hasMany(Review, { foreignKey: 'videoId', as: 'reviews' });
Review.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
Review.hasMany(Reply, { foreignKey: 'reviewId', as: 'replies' });
Reply.belongsTo(Review, { foreignKey: 'reviewId', as: 'review' });

const handler = nextConnect();

handler.get(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Video ID is required.' });
  }

  try {
    const video = await Video.findByPk(id, {
      include: {
        model: Review,
        as: 'reviews',
        include: {
          model: Reply,
          as: 'replies',
        },
      },
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error('Error retrieving video:', error);
    res.status(500).json({ error: 'Error retrieving video.' });
  }
});

export default handler;
