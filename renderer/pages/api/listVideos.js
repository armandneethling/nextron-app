import { createRouter } from 'next-connect';
import path from 'path';
import fs from 'fs';

const apiRoute = createRouter()
  .get((req, res) => {
    const dataFilePath = path.join(process.cwd(), 'data', 'videos.json');

    // Read existing videos from the JSON file
    let videos = [];
    if (fs.existsSync(dataFilePath)) {
      try {
        const fileData = fs.readFileSync(dataFilePath);
        videos = JSON.parse(fileData);
      } catch (error) {
        console.error('Error parsing videos.json:', error);
        return res.status(500).json({ error: 'Failed to read video data' });
      }
    }

    res.status(200).json({ videos });
  })
  .handler();

export default apiRoute;
