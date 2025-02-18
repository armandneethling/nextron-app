import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import ReactStarsWrapper from '../../components/ReactStarsWrapper';
import styles from '../../styles/VideoDetail.module.css';

const VideoDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [replyComment, setReplyComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const storedUserId = localStorage.getItem('userId');
      const storedUserRole = localStorage.getItem('userRole');
      if (storedUserId) {
        setUserId(storedUserId);
        setUserRole(storedUserRole);
      } else {
        router.push('/login');
      }
    };

    const fetchVideo = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/getVideos?id=${id}`, { cache: 'no-store' });
          const result = await response.json();
          setVideo(result);
          setReviews(result.reviews || []);
        } catch (error) {
          console.error('Error fetching video:', error);
        }
      }
    };

    fetchUser();
    fetchVideo();
  }, [id, router]);

  const handleReplySubmit = async (reviewId) => {
    if (userRole !== 'admin') {
      setNotification({ message: 'Only admins can reply to reviews.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      return;
    }
  
    if (!replyComment.trim()) {
      setNotification({ message: 'Please write a reply.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      return;
    }
  
    const replyData = {
      videoId: video.id,
      reviewId,
      userId,
      comment: replyComment.trim(),
    };
  
    console.log('Reply Data:', replyData);
  
    try {
      const response = await fetch('/api/reviews/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyData),
      });
  
      if (response.ok) {
        const data = await response.json();
        setReviews(
          reviews.map((review) =>
            review.id === reviewId
              ? { ...review, replies: [...(review.replies || []), data.reply] }
              : review
          )
        );
        setReplyComment('');
        setNotification({ message: 'Reply submitted successfully.', type: 'success' });
      } else {
        const errorData = await response.json();
        setNotification({ message: `Error submitting reply: ${errorData.error}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      setNotification({ message: 'An error occurred while submitting your reply.', type: 'error' });
    } finally {
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };  

  const handleReviewSubmit = async () => {
    if (newRating === 0 || !newComment.trim()) {
      setNotification({ message: 'Please provide a rating and a comment.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      return;
    }

    const reviewData = {
      videoId: video.id,
      userId,
      rating: newRating,
      comment: newComment.trim(),
    };

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const data = await response.json();
        setReviews([...reviews, data.review]);
        setNotification({ message: 'Review submitted successfully.', type: 'success' });
        setNewRating(0);
        setNewComment('');
      } else {
        const errorData = await response.json();
        setNotification({ message: `Error submitting review: ${errorData.error}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setNotification({ message: 'An error occurred while submitting your review.', type: 'error' });
    } finally {
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  if (!video) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
      <h1 className={styles.title}>{video.title}</h1>
        <div className={styles.thumbnailContainer}>
          <img
            src={`/uploads/${video.thumbnail}`}
            alt={`${video.title} thumbnail`}
            className={styles.thumbnail}
          />
        </div>
        <div className={styles.videoContainer}>
          <video controls className={styles.videoPlayer}>
            <source src={`/uploads/${video.filename}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>Video Information</h2>
          <p className={styles.subHeader}>Description:</p>
          <p className={styles.info}>{video.description}</p>
          <p className={styles.subHeader}>Category:</p>
          <p className={styles.info}>{video.category}</p>
          <p className={styles.subHeader}>Privacy:</p>
          <p className={styles.info}>{video.privacy}</p>
          <p className={styles.subHeader}>Duration:</p>
          <p className={styles.info}>{video.duration} seconds</p>
          <p className={styles.subHeader}>Uploaded at:</p>
          <p className={styles.info}>
            {new Date(video.createdAt).toLocaleString()}
          </p>
        </div>

        <div className={styles.reviewsSection}>
          <h2 className={styles.reviewTitle}>Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className={styles.review}>
                <ReactStarsWrapper
                  count={5}
                  value={review.rating}
                  edit={false}
                  size={24}
                  activeColor="#ffd700"
                />
                <p>{review.comment}</p>
                {review.userId === userId && (
                  <div className={styles.reviewActions}>
                    <button className={`${styles.button} ${styles.btnPrimary}`} onClick={() => handleEditReview(review)}>Edit</button>
                    <button className={`${styles.button} ${styles.btnPrimary}`} onClick={() => handleDeleteReview(review.id)}>Delete</button>
                  </div>
                )}
                {review.replies && review.replies.length > 0 && (
                  <div className={styles.replies}>
                    {review.replies.map((reply) => (
                      <div key={reply.id} className={styles.reply}>
                        <p>
                          <strong>
                            {reply.userId === 'admin'
                              ? 'Admin'
                              : reply.userId === video.uploaderId
                              ? 'Uploader'
                              : 'User'}
                          :
                          </strong>{' '}
                          {reply.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {userRole === 'admin' && (
                  <div className={styles.replyForm}>
                    <textarea
                      className={`${styles.input} ${styles.textarea} ${styles.inputFocus}`}
                      value={replyComment}
                      onChange={(e) => setReplyComment(e.target.value)}
                      placeholder="Write your reply here..."
                    />
                    <button className={`${styles.button} ${styles.btnPrimary}`} onClick={() => handleReplySubmit(review.id)}>Submit Reply</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}

          <div className={styles.reviewForm}>
            <h3 className={styles.reviewFormTitle}>{editingReviewId ? 'Edit Your Review' : 'Write a Review'}</h3>
            <ReactStarsWrapper
              count={5}
              value={newRating}
              onChange={(rating) => setNewRating(rating)}
              size={24}
              activeColor="#ffd700"
            />
            <textarea
              className={`${styles.input} ${styles.textarea} ${styles.inputFocus}`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your review here..."
            />
            <div className={styles.buttonContainer}>
              <button className={`${styles.button} ${styles.btnPrimary}`} onClick={handleReviewSubmit}>
                {editingReviewId ? 'Update Review' : 'Submit Review'}
              </button>
              {notification.message && (
                <div className={`${styles.alert} ${notification.type === 'success' ? styles['alert--success'] : styles['alert--error']}`}>
                  {notification.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoDetails;
