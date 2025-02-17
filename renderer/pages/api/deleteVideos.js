import nextConnect from 'next-connect';
import { sequelize } from '../../../../utils/database';
import defineReviewModel from '../../../../models/Review';
import defineReplyModel from '../../../../models/Reply';
import defineVideoModel from '../../../../models/Video';
import fs from 'fs';
import path from 'path';

const Video = defineVideoModel(sequelize);
const Review = defineReviewModel(sequelize);
const Reply = defineReplyModel(sequelize);

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

    const videoFilePath = path.join(process.cwd(), 'renderer/public/uploads', video.filename);
    const thumbnailFilePath = path.join(process.cwd(), 'renderer/public/uploads', video.thumbnail);

    await video.destroy();

    // Delete the video file
    fs.unlink(videoFilePath, (err) => {
      if (err) {
        console.error('Error deleting video file:', err);
      } else {
        console.log('Video file deleted:', videoFilePath);
      }
    });

    fs.unlink(thumbnailFilePath, (err) => {
      if (err) {
        console.error('Error deleting thumbnail file:', err);
      } else {
        console.log('Thumbnail file deleted:', thumbnailFilePath);
      }
    });

    res.status(200).json({ message: 'Video and associated files deleted successfully.' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Error deleting video.' });
  }
});

export default handler;
