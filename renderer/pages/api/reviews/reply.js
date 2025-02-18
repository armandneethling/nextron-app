import withSession from '../../../../utils/withSession';
import Review from '../../../../models/Review';

const reviewHandler = async (req, res) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const { videoId, userId, rating, comment, reviewId } = req.body;

    if (!videoId || !userId || !rating || !comment) {
      console.log('Missing required fields:', { videoId, userId, rating, comment, reviewId });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      let review;
      if (req.method === 'POST') {
        review = await Review.create({ videoId, userId, rating, comment });
        console.log('Review created:', review);
      } else if (req.method === 'PUT') {
        review = await Review.findByPk(reviewId);
        if (!review) {
          console.log('Review not found:', reviewId);
          return res.status(404).json({ error: 'Review not found' });
        }
        review.rating = rating;
        review.comment = comment;
        await review.save();
        console.log('Review updated:', review);
      }

      res.status(200).json({ review });
    } catch (error) {
      console.error('Error handling review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default withSession(reviewHandler);