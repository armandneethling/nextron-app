import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    try {
      const filePath = path.resolve('./data/videos.json');
      const data = await fsPromises.readFile(filePath, 'utf8');
      const videos = JSON.parse(data);

      const videoIndex = videos.findIndex(v => v.id === id);

      if (videoIndex !== -1) {
        const [video] = videos.splice(videoIndex, 1);

        const videoPath = path.join(process.cwd(), 'renderer/public/uploads', video.filename);
        const thumbnailPath = path.join(process.cwd(), 'renderer/public/uploads', video.thumbnail);

        await fsPromises.writeFile(filePath, JSON.stringify(videos, null, 2));

        fs.unlink(videoPath, (err) => {
          if (err) {
            console.error('Error deleting video file:', err);
            return res.status(500).json({ error: 'Error deleting video file' });
          }
        });

        fs.unlink(thumbnailPath, (err) => {
          if (err) {
            console.error('Error deleting thumbnail file:', err);
            return res.status(500).json({ error: 'Error deleting thumbnail file' });
          }
        });

        return res.status(200).json({ message: 'Video deleted successfully' });
      } else {
        return res.status(404).json({ error: 'Video not found' });
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      return res.status(500).json({ error: 'Error deleting video' });
    }
  } else {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}
