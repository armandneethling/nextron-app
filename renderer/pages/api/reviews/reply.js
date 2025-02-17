import nextConnect from 'next-connect';
import { sequelize } from '../../../../utils/database';
import defineReviewModel from '../../../../models/Review';
import defineReplyModel from '../../../../models/Reply';
import defineVideoModel from '../../../../models/Video';

const Review = defineReviewModel(sequelize);
const Reply = defineReplyModel(sequelize);
const Video = defineVideoModel(sequelize);

Video.hasMany(Review, { foreignKey: 'videoId', as: 'reviews' });
Review.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
Review.hasMany(Reply, { foreignKey: 'reviewId', as: 'replies' });
Reply.belongsTo(Review, { foreignKey: 'reviewId', as: 'review' });

const handler = nextConnect();

const isAdmin = (role) => {
  return role === 'admin';
};

handler.post(async (req, res) => {
  const { reviewId, userId, userRole, comment } = req.body;

  if (!reviewId || !userId || !userRole || !comment) {
    return res.status(400).json({ error: 'Invalid data.' });
  }

  try {
    const review = await Review.findByPk(reviewId, {
      include: { model: Video, as: 'video' },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    const video = review.video;

    if (userId !== video.uploaderId && !isAdmin(userRole)) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    const reply = await Reply.create({
      reviewId,
      userId,
      comment,
      createdAt: new Date(),
    });

    res.status(201).json({ reply });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Error adding reply.' });
  }
});

export default handler;
