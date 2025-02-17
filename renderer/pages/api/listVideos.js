import nextConnect from 'next-connect';
import path from 'path';
import { promises as fs } from 'fs';

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    const filePath = path.resolve('./data/videos.json');
    const data = await fs.readFile(filePath, 'utf8');
    const videos = JSON.parse(data);

    return res.status(200).json({ videos });
  } catch (error) {
    console.error('Error reading video data:', error);
    return res.status(500).json({ error: 'Error reading video data' });
  }
});

export default handler;
