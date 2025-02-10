import { createRouter } from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'renderer/public/videos/');
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

    const videoData = {
        filename: video.originalname,
        title,
        description,
        category,
        thumbnail: thumbnail.originalname,
        privacy
    }
    res.status(200).json({ message: 'Video uploaded successfully', video: videoData });
  })
  .handler();

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
