import Video from '../../models/Video';
import sequelize from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      await sequelize.sync(); // Ensure the database is synced
      const video = await Video.findByPk(id);
      if (video) {
        res.status(200).json({ video });
      } else {
        res.status(404).json({ error: 'Video not found' });
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      res.status(500).json({ error: 'Error fetching video' });
    }
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}