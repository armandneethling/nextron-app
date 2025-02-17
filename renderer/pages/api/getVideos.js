import nextConnect from 'next-connect';
import path from 'path';
import { promises as fs } from 'fs';

const handler = nextConnect();

const getVideosData = async () => {
  const filePath = path.resolve('./data/videos.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

handler.get(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Video ID is required.' });
  }

  try {
    const videos = await getVideosData();
    const video = videos.find((v) => v.id === id);

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
