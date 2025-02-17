import nextConnect from 'next-connect';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fsPromises } from 'fs';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), 'renderer/public/uploads')); // Use the correct path
    },
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}_${file.originalname}`);
    },
  }),
});

const apiRoute = nextConnect();

apiRoute.use(upload.fields([{ name: 'video' }, { name: 'thumbnail' }]));

apiRoute.post(async (req, res) => {
  try {
    const videoFile = req.files['video'] ? req.files['video'][0] : null;
    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;

    if (!videoFile || !thumbnailFile) {
      return res.status(400).json({ error: 'Video file and thumbnail are required.' });
    }

    const videoId = uuidv4();
    const newVideo = {
      id: videoId,
      filename: videoFile.filename,
      thumbnail: thumbnailFile.filename,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      privacy: req.body.privacy,
      duration: req.body.duration ? parseFloat(req.body.duration) : null,
      createdAt: new Date().toISOString(),
    };

    const filePath = path.resolve('./data/videos.json');
    const data = await fsPromises.readFile(filePath, 'utf8');
    const videos = JSON.parse(data);

    videos.push(newVideo);
    await fsPromises.writeFile(filePath, JSON.stringify(videos, null, 2));

    res.status(201).json({ video: newVideo });
  } catch (error) {
    console.error('Error saving video:', error);
    res.status(500).json({ error: 'Error saving video' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
