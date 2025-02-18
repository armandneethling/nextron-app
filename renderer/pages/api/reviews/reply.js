import withSession from '../../../../utils/withSession';
import db from '../../../../models';

const replyHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { reviewId, userId, comment } = req.body;

    if (!reviewId || !userId || !comment) {
      console.log('Missing required fields:', { reviewId, userId, comment });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const review = await db.Review.findByPk(reviewId);
      if (!review) {
        console.log('Review not found:', reviewId);
        return res.status(404).json({ error: 'Review not found' });
      }

      const reply = await db.Reply.create({
        reviewId,
        userId,
        comment,
      });

      console.log('Reply added:', reply);

      res.status(200).json({ reply });
    } catch (error) {
      console.error('Error handling reply:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    const { replyId, userId, comment } = req.body;

    if (!replyId || !userId || !comment) {
      console.log('Missing required fields:', { replyId, userId, comment });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const reply = await db.Reply.findByPk(replyId);

      if (!reply) {
        console.log('Reply not found:', replyId);
        return res.status(404).json({ error: 'Reply not found' });
      }

      if (reply.userId !== userId) {
        console.log('Unauthorized user:', userId);
        return res.status(403).json({ error: 'Unauthorized' });
      }

      reply.comment = comment;
      await reply.save();

      console.log('Reply updated:', reply);

      res.status(200).json({ reply });
    } catch (error) {
      console.error('Error updating reply:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    const { replyId, userId } = req.body;

    if (!replyId || !userId) {
      console.log('Missing required fields:', { replyId, userId });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const reply = await db.Reply.findByPk(replyId);

      if (!reply) {
        console.log('Reply not found:', replyId);
        return res.status(404).json({ error: 'Reply not found' });
      }

      if (reply.userId !== userId) {
        console.log('Unauthorized user:', userId);
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await reply.destroy();

      console.log('Reply deleted:', replyId);

      res.status(200).json({ message: 'Reply deleted successfully' });
    } catch (error) {
      console.error('Error deleting reply:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default withSession(replyHandler);
