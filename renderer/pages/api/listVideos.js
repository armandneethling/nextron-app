import { createRouter } from 'next-connect';
import fs from 'fs';
import path from 'path';

const apiRoute = createRouter()
  .get((req, res) => {
    const videosDir = path.join(process.cwd(), 'renderer/public/videos');
    fs.readdir(videosDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to list videos' });
      }
      const videoFiles = files.filter(file => file.endsWith('.mp4')); // Filter for video files
      res.status(200).json({ videos: videoFiles });
    });
  })
  .handler();

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
