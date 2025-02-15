import { Video } from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const videos = await Video.findAll({ order: [['createdAt', 'DESC']] });
      res.status(200).json({ videos });
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'Error fetching videos' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}
