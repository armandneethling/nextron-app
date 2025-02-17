import nextConnect from 'next-connect';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { sequelize } from '../../utils/database';
import defineVideoModel from '../../../models/Video';
import getVideoDurationInSeconds from 'get-video-duration';

// Initialize the Video model
const Video = defineVideoModel(sequelize);

// Configure Multer for file uploads
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
    // Validate file types
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

// Handle multipart/form-data
apiRoute.use(upload.fields([{ name: 'video' }, { name: 'thumbnail' }]));

apiRoute.post(async (req, res) => {
  try {
    const videoFile = req.files['video'] ? req.files['video'][0] : null;
    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;

    if (!videoFile || !thumbnailFile) {
      return res.status(400).json({ error: 'Video file and thumbnail are required.' });
    }

    const videoPath = path.join(process.cwd(), 'renderer/public/uploads', videoFile.filename);
    const durationInSeconds = await getVideoDurationInSeconds(videoPath);

    const video = await Video.create({
      id: uuidv4(),
      filename: videoFile.filename,
      thumbnail: thumbnailFile.filename,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      privacy: req.body.privacy,
      duration: Math.round(durationInSeconds),
      createdAt: new Date(),
    });

    res.status(201).json({ video });
  } catch (error) {
    console.error('Error saving video:', error);
    res.status(500).json({ error: 'Error saving video.' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};