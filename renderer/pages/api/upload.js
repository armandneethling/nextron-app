// pages/api/upload.js

import nextConnect from 'next-connect';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import initializeDatabase from '../../utils/initializeDatabase';
import Video from '../../models/Video';

const upload = multer({ dest: 'public/uploads/' });

const apiRoute = nextConnect();

apiRoute.use(upload.fields([{ name: 'video' }, { name: 'thumbnail' }]));

apiRoute.post(async (req, res) => {
  await initializeDatabase(); // Initialize DB connection

  const videoFile = req.files['video'][0];
  const thumbnailFile = req.files['thumbnail'][0];

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
  };

  try {
    await Video.create(newVideo);
    res.status(201).json({ video: newVideo });
  } catch (error) {
    console.error('Error saving video:', error);
    res.status(500).json({ error: 'Error saving video' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
