import nextConnect from 'next-connect';
import path from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const handler = nextConnect();

const getVideosData = async () => {
  const filePath = path.resolve('./data/videos.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

const saveVideosData = async (videos) => {
  const filePath = path.resolve('./data/videos.json');
  await fs.writeFile(filePath, JSON.stringify(videos, null, 2));
};

// Helper function to check if a user is an admin
const isAdmin = (userId) => {
  // Implement your logic to determine if the user is an admin
  // For example:
  return userId === 'admin'; // Placeholder logic
};

// POST handler to add a new review
handler.post(async (req, res) => {
  const { videoId, userId, rating, comment } = req.body;

  if (!videoId || !userId || rating == null || !comment) {
    return res.status(400).json({ error: 'Invalid data.' });
  }

  try {
    const videos = await getVideosData();
    const video = videos.find((v) => v.id === videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }

    const reviewId = uuidv4();
    const newReview = {
      id: reviewId,
      userId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    if (!video.reviews) {
      video.reviews = [];
    }

    video.reviews.push(newReview);
    await saveVideosData(videos);

    res.status(201).json({ review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Error adding review.' });
  }
});

// PUT handler to edit a review
handler.put(async (req, res) => {
  const { videoId, reviewId, userId, rating, comment } = req.body;

  if (!videoId || !reviewId || !userId || rating == null || !comment) {
    return res.status(400).json({ error: 'Invalid data.' });
  }

  try {
    const videos = await getVideosData();
    const video = videos.find((v) => v.id === videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }

    const review = video.reviews.find(
      (r) => r.id === reviewId && r.userId === userId
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized.' });
    }

    // Update review fields
    review.rating = rating;
    review.comment = comment;
    review.updatedAt = new Date().toISOString();

    await saveVideosData(videos);

    res.status(200).json({ review });
  } catch (error) {
    console.error('Error editing review:', error);
    res.status(500).json({ error: 'Error editing review.' });
  }
});

// DELETE handler to delete a review
handler.delete(async (req, res) => {
  const { videoId, reviewId, userId } = req.body;

  if (!videoId || !reviewId || !userId) {
    return res.status(400).json({ error: 'Invalid data.' });
  }

  try {
    const videos = await getVideosData();
    const video = videos.find((v) => v.id === videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }

    const reviewIndex = video.reviews.findIndex(
      (r) => r.id === reviewId && r.userId === userId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Review not found or unauthorized.' });
    }

    // Remove the review
    video.reviews.splice(reviewIndex, 1);

    await saveVideosData(videos);

    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Error deleting review.' });
  }
});

// Separate handler for adding replies to reviews
handler.post('/reply', async (req, res) => {
  const { videoId, reviewId, userId, comment } = req.body;

  if (!videoId || !reviewId || !userId || !comment) {
    return res.status(400).json({ error: 'Invalid data.' });
  }

  try {
    const videos = await getVideosData();
    const video = videos.find((v) => v.id === videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }

    const review = video.reviews.find((r) => r.id === reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found.' });
    }

    // Check if user is the uploader or an admin
    if (userId !== video.uploaderId && !isAdmin(userId)) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    const replyId = uuidv4();
    const newReply = {
      id: replyId,
      userId,
      comment,
      createdAt: new Date().toISOString(),
    };

    if (!review.replies) {
      review.replies = [];
    }

    review.replies.push(newReply);
    await saveVideosData(videos);

    res.status(201).json({ reply: newReply });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Error adding reply.' });
  }
});

export default handler;