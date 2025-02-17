import nextConnect from 'next-connect';
import { sequelize } from '../../utils/database';
import defineVideoModel from '../../../models/Video';
import defineReviewModel from '../../../models/Review';
import defineReplyModel from '../../../models/Reply';

const Review = defineReviewModel(sequelize);
const Video = defineVideoModel(sequelize);
const Reply = defineReplyModel(sequelize);

// Define associations
Video.hasMany(Review, { foreignKey: 'videoId', as: 'reviews' });
Review.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
Review.hasMany(Reply, { foreignKey: 'reviewId', as: 'replies' });
Reply.belongsTo(Review, { foreignKey: 'reviewId', as: 'review' });

const handler = nextConnect();

handler.post(async (req, res) => {
  const { videoId, userId, rating, comment } = req.body;

  if (!videoId || !userId || rating == null || !comment) {
    return res.status(400).json({ error: 'Invalid data.' });
  }

  try {
    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }

    const review = await Review.create({
      videoId,
      userId,
      rating,
      comment,
      createdAt: new Date(),
    });

    res.status(201).json({ review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Error adding review.' });
  }
});

handler.put(async (req, res) => {
  const { reviewId, userId, rating, comment } = req.body;

  if (!reviewId || !userId || rating == null || !comment) {
    return res.status(400).json({ error: 'Invalid data.' });
  }

  try {
    const review = await Review.findOne({ where: { id: reviewId, userId } });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized.' });
    }

    await review.update({
      rating,
      comment,
      updatedAt: new Date(),
    });

    res.status(200).json({ review });
  } catch (error) {
    console.error('Error editing review:', error);
    res.status(500).json({ error: 'Error editing review.' });
  }
});

handler.delete(async (req, res) => {
  const { reviewId, userId } = req.body;

  if (!reviewId || !userId) {
    return res.status(400).json({ error: 'Invalid data.' });
  }

  try {
    const review = await Review.findOne({ where: { id: reviewId, userId } });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized.' });
    }

    await review.destroy();

    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Error deleting review.' });
  }
});

export default handler;