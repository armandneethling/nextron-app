import fs from 'fs';
import path from 'path';
import Video from '../../models/Video';
import sequelize from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    try {
      await sequelize.sync();
      const video = await Video.findByPk(id);

      if (video) {
        await video.destroy();

        const videoPath = path.join(process.cwd(), 'renderer/public/uploads', video.filename);
        const thumbnailPath = path.join(process.cwd(), 'renderer/public/uploads', video.thumbnail);

        fs.unlink(videoPath, (err) => {
          if (err) console.error('Error deleting video file:', err);
        });

        fs.unlink(thumbnailPath, (err) => {
          if (err) console.error('Error deleting thumbnail file:', err);
        });

        res.status(200).json({ message: 'Video deleted successfully' });
      } else {
        res.status(404).json({ error: 'Video not found' });
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ error: 'Error deleting video' });
    }
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}
