import withSession from '../../../../utils/withSession';
import Review from '../../../../models/Review';

const replyHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { videoId, reviewId, userId, comment } = req.body;

    if (!videoId || !reviewId || !userId || !comment) {
      console.log('Missing required fields:', { videoId, reviewId, userId, comment });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      console.log('Fetching review:', reviewId);
      const review = await Review.findByPk(reviewId);
      if (!review) {
        console.log('Review not found:', reviewId);
        return res.status(404).json({ error: 'Review not found' });
      }

      const reply = {
        userId,
        comment,
      };

      console.log('Current replies:', review.replies);
      review.replies = review.replies ? [...review.replies, reply] : [reply];
      console.log('Updated replies:', review.replies);
      await review.save();

      console.log('Reply saved successfully');
      res.status(200).json({ reply });
    } catch (error) {
      console.error('Error saving reply:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default withSession(replyHandler);
