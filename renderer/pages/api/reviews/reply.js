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

const isAdmin = (userId) => {
  return userId === 'admin';
};

handler.post(async (req, res) => {
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
