import { createRouter } from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'renderer/public/uploads/');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

const apiRoute = createRouter()
  .use(upload.fields([{ name: 'video' }, { name: 'thumbnail' }]))
  .post((req, res) => {
    const { title, description, category, privacy } = req.body;
    const video = req.files.video[0];
    const thumbnail = req.files.thumbnail[0];

    const videoId = Date.now();

    const videoData = {
      id: videoId,
      filename: video.originalname,
      thumbnail: thumbnail.originalname,
      title,
      description,
      category,
      privacy,
    };

    const dataFilePath = path.join(process.cwd(), 'data', 'videos.json');

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

    videos.push(videoData);

    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2));
      res.status(200).json({ message: 'Video uploaded successfully', video: videoData });
    } catch (error) {
      console.error('Error writing to videos.json:', error);
      res.status(500).json({ error: 'Failed to save video data' });
    }
  })
  .handler();

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
