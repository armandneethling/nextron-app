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
  .use(upload.single('video'))
  .post((req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({ message: 'Video uploaded successfully', filename: req.file.originalname });
  })
  .handler({
    onError(error, req, res) {
      res.status(501).json({ error: `Sorry, something went wrong! ${error.message}` });
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
  });

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
