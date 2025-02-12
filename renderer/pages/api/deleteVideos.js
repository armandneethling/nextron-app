import { createRouter } from 'next-connect';
import path from 'path';
import fs from 'fs';

const apiRoute = createRouter()
  .delete((req, res) => {
    const { id } = req.body;
    const uploadDir = path.join(process.cwd(), 'renderer/public/uploads/');
    const dataFilePath = path.join(process.cwd(), 'data', 'videos.json');

    if (!id) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

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

    const videoIndex = videos.findIndex((video) => video.id === id);
    if (videoIndex === -1) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const [video] = videos.splice(videoIndex, 1);

    const videoPath = path.join(uploadDir, video.filename);
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    } else {
      console.warn(`Video file not found: ${videoPath}`);
    }

    const thumbnailPath = path.join(uploadDir, video.thumbnail);
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    } else {
      console.warn(`Thumbnail file not found: ${thumbnailPath}`);
    }

    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2));
      res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
      console.error('Error writing to videos.json:', error);
      res.status(500).json({ error: 'Failed to update video data' });
    }
  })
  .handler();

export default apiRoute;

export const config = {
  api: {
    bodyParser: true,
  },
};
