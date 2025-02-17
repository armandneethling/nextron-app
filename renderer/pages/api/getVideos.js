import nextConnect from 'next-connect';
import path from 'path';
import { promises as fs } from 'fs';

const handler = nextConnect();

handler.get(async (req, res) => {
  const { id } = req.query;
  console.log('Requested video ID:', id);

  if (!id) {
    console.log('No ID provided in request');
    return res.status(400).json({ error: 'No ID provided' });
  }

  try {
    const filePath = path.resolve('./data/videos.json');
    const data = await fs.readFile(filePath, 'utf8');
    const videos = JSON.parse(data);
    const video = videos.find((v) => v.id === id);

    if (video) {
      console.log('Fetched video:', video);
      return res.status(200).json(video);
    } else {
      console.log('Video not found for ID:', id);
      return res.status(404).json({ error: 'Video not found' });
    }
  } catch (error) {
    console.error('Error reading video data:', error);
    return res.status(500).json({ error: 'Error reading video data' });
  }
});

export default handler;
