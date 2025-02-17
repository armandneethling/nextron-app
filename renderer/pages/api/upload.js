import nextConnect from 'next-connect';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fsPromises } from 'fs';
import getVideoDurationInSeconds from 'get-video-duration';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), 'renderer/public/uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}_${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only video files are allowed.'), false);
      }
    } else if (file.fieldname === 'thumbnail') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only image files are allowed for thumbnails.'), false);
      }
    } else {
      cb(new Error('Unknown field.'), false);
    }
  },
});

const apiRoute = nextConnect();

apiRoute.use(upload.fields([{ name: 'video' }, { name: 'thumbnail' }]));

apiRoute.post(async (req, res) => {
  try {
    const videoFile = req.files['video'] ? req.files['video'][0] : null;
    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;

    if (!videoFile) {
      return res.status(400).json({ error: 'Video file is required.' });
    }
    if (!thumbnailFile) {
      return res.status(400).json({ error: 'Thumbnail image is required.' });
    }
    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    if (!req.body.description || !req.body.description.trim()) {
      return res.status(400).json({ error: 'Description is required.' });
    }
    if (!req.body.category || !req.body.category.trim()) {
      return res.status(400).json({ error: 'Category is required.' });
    }
    if (!['public', 'private'].includes(req.body.privacy)) {
      return res.status(400).json({ error: 'Invalid privacy option.' });
    }

    const videoId = uuidv4();
    const videoPath = path.join(process.cwd(), 'renderer/public/uploads', videoFile.filename);

    const durationInSeconds = await getVideoDurationInSeconds(videoPath);

    const newVideo = {
      id: videoId,
      uploaderId: req.body.uploaderId || 'uploader-123',
      filename: videoFile.filename,
      thumbnail: thumbnailFile.filename,
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      category: req.body.category.trim(),
      privacy: req.body.privacy,
      duration: Math.round(durationInSeconds),
      createdAt: new Date().toISOString(),
    };

    const filePath = path.resolve('./data/videos.json');
    let videos = [];

    try {
      const data = await fsPromises.readFile(filePath, 'utf8');
      videos = JSON.parse(data);
    } catch (error) {
      console.log('No existing videos.json file. A new one will be created.');
    }

    videos.push(newVideo);
    await fsPromises.writeFile(filePath, JSON.stringify(videos, null, 2));

    res.status(201).json({ video: newVideo });
  } catch (error) {
    console.error('Error saving video:', error);
    res.status(500).json({ error: 'Error saving video. ' + error.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, 
  },
};