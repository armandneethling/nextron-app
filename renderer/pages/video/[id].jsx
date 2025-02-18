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
  const [replyComments, setReplyComments] = useState({});
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [updatedRating, setUpdatedRating] = useState(0);
  const [updatedComment, setUpdatedComment] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchUser = () => {
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

    if (router.isReady) {
      fetchUser();
      fetchVideo();
    }
  }, [id, router]);

  const handleReplySubmit = async (reviewId) => {
    if (userRole !== 'admin') {
      setNotification({ message: 'Only admins can reply to reviews.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      return;
    }

    const replyComment = replyComments[reviewId];

    if (!replyComment || !replyComment.trim()) {
      setNotification({ message: 'Please write a reply.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      return;
    }

    const replyData = {
      reviewId,
      userId,
      comment: replyComment.trim(),
      ...(editingReplyId && { replyId: editingReplyId }),
    };

    try {
      const response = await fetch('/api/reviews/reply', {
        method: editingReplyId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyData),
      });

      if (response.ok) {
        const data = await response.json();

        if (data && data.reply) {
          setReviews((prevReviews) =>
            prevReviews.map((review) =>
              review.id === reviewId
                ? {
                    ...review,
                    replies: editingReplyId
                      ? review.replies.map((r) =>
                          r.id === editingReplyId ? data.reply : r
                        )
                      : [...(review.replies || []), data.reply],
                  }
                : review
            )
          );
          setReplyComments((prev) => ({ ...prev, [reviewId]: '' }));
          setEditingReplyId(null);
          setNotification({
            message: editingReplyId
              ? 'Reply edited successfully.'
              : 'Reply submitted successfully.',
            type: 'success',
          });
        } else {
          setNotification({
            message: 'Invalid reply data received from server.',
            type: 'error',
          });
        }
      } else {
        const errorData = await response.json();
        setNotification({
          message: `Error submitting reply: ${errorData.error}`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      setNotification({
        message: 'An error occurred while submitting your reply.',
        type: 'error',
      });
    } finally {
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  const handleDeleteReply = async (reviewId, replyId) => {
    if (userRole !== 'admin') {
      setNotification({ message: 'Only admins can delete replies.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      return;
    }

    try {
      const response = await fetch('/api/reviews/reply', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ replyId, userId }),
      });

      if (response.ok) {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  replies: review.replies.filter((reply) => reply.id !== replyId),
                }
              : review
          )
        );
        setNotification({ message: 'Reply deleted successfully.', type: 'success' });
      } else {
        const errorData = await response.json();
        setNotification({
          message: `Error deleting reply: ${errorData.error}`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      setNotification({
        message: 'An error occurred while deleting the reply.',
        type: 'error',
      });
    } finally {
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  const handleEditReply = (replyId, reviewId, currentComment) => {
    setEditingReplyId(replyId);
    setReplyComments((prev) => ({ ...prev, [reviewId]: currentComment }));
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
        setNotification({
          message: `Error submitting review: ${errorData.error}`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setNotification({
        message: 'An error occurred while submitting your review.',
        type: 'error',
      });
    } finally {
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, userId }),
      });

      if (response.ok) {
        setReviews(reviews.filter((review) => review.id !== reviewId));
        setNotification({ message: 'Review deleted successfully.', type: 'success' });
      } else {
        const errorData = await response.json();
        setNotification({
          message: `Error deleting review: ${errorData.error}`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setNotification({
        message: 'An error occurred while deleting your review.',
        type: 'error',
      });
    } finally {
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setUpdatedRating(review.rating);
    setUpdatedComment(review.comment);
  };

  const handleUpdateReview = async () => {
    if (updatedRating === 0 || !updatedComment.trim()) {
      setNotification({ message: 'Please provide a rating and a comment.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      return;
    }

    const reviewData = {
      reviewId: editingReviewId,
      userId,
      rating: updatedRating,
      comment: updatedComment.trim(),
    };

    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const data = await response.json();

        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === editingReviewId ? { ...review, ...data.review } : review
          )
        );

        setNotification({ message: 'Review updated successfully.', type: 'success' });
        setEditingReviewId(null);
        setUpdatedRating(0);
        setUpdatedComment('');
      } else {
        const errorData = await response.json();
        setNotification({
          message: `Error updating review: ${errorData.error}`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating review:', error);
      setNotification({
        message: 'An error occurred while updating your review.',
        type: 'error',
      });
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
          <p className={styles.info}>{new Date(video.createdAt).toLocaleString()}</p>
        </div>

        <div className={styles.reviewsSection}>
          <h2 className={styles.reviewTitle}>Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className={styles.review}>
                {editingReviewId === review.id ? (
                  <div className={styles.reviewEditForm}>
                    <ReactStarsWrapper
                      count={5}
                      value={updatedRating}
                      onChange={(rating) => setUpdatedRating(rating)}
                      size={24}
                      activeColor="#ffd700"
                    />
                    <textarea
                      className={`${styles.input} ${styles.textarea} ${styles.inputFocus}`}
                      value={updatedComment}
                      onChange={(e) => setUpdatedComment(e.target.value)}
                      placeholder="Edit your review..."
                    />
                    <div className={styles.buttonContainer}>
                      <button
                        className={`${styles.button} ${styles.btnPrimary}`}
                        onClick={handleUpdateReview}
                      >
                        Update Review
                      </button>
                      <button
                        className={`${styles.button} ${styles.btnSecondary}`}
                        onClick={() => {
                          setEditingReviewId(null);
                          setUpdatedRating(0);
                          setUpdatedComment('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                        <button
                          className={`${styles.button} ${styles.btnPrimary}`}
                          onClick={() => handleEditReview(review)}
                        >
                          Edit
                        </button>
                        <button
                          className={`${styles.button} ${styles.btnPrimary}`}
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
                {review.replies && review.replies.length > 0 && (
  <div className={styles.replies}>
    {review.replies.map((reply) => (
      <div key={reply.id} className={styles.reply}>
        <p>
          <strong>
            {reply.userId === userId && userRole === 'admin'
              ? 'Admin'
              : reply.userId === video.uploaderId
              ? 'Uploader'
              : 'User'}
            :
          </strong>{' '}
          {reply.comment}
        </p>
        {userRole === 'admin' && reply.userId === userId && (
          <div className={styles.replyActions}>
            <button
              className={`${styles.button} ${styles.btnPrimary}`}
              onClick={() => handleEditReply(reply.id, review.id, reply.comment)}
            >
              Edit
            </button>
            <button
              className={`${styles.button} ${styles.btnPrimary}`}
              onClick={() => handleDeleteReply(review.id, reply.id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
)}

                {userRole === 'admin' &&
                  !review.replies?.some((r) => r.userId === userId) &&
                  editingReplyId === null && (
                    <div className={styles.replyForm}>
                      <textarea
                        className={`${styles.input} ${styles.textarea} ${styles.inputFocus}`}
                        value={replyComments[review.id] || ''}
                        onChange={(e) =>
                          setReplyComments((prev) => ({
                            ...prev,
                            [review.id]: e.target.value,
                          }))
                        }
                        placeholder="Write your reply here..."
                      />
                      <button
                        className={`${styles.button} ${styles.btnPrimary}`}
                        onClick={() => handleReplySubmit(review.id)}
                      >
                        Submit Reply
                      </button>
                    </div>
                  )}
                {userRole === 'admin' &&
                  editingReplyId &&
                  review.replies?.some((r) => r.id === editingReplyId) && (
                    <div className={styles.replyForm}>
                      <textarea
                        className={`${styles.input} ${styles.textarea} ${styles.inputFocus}`}
                        value={replyComments[review.id] || ''}
                        onChange={(e) =>
                          setReplyComments((prev) => ({
                            ...prev,
                            [review.id]: e.target.value,
                          }))
                        }
                        placeholder="Edit your reply here..."
                      />
                      <button
                        className={`${styles.button} ${styles.btnPrimary}`}
                        onClick={() => handleReplySubmit(review.id)}
                      >
                        Update Reply
                      </button>
                    </div>
                  )}
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
          {!editingReviewId && (
            <div className={styles.reviewForm}>
              <h3 className={styles.reviewFormTitle}>Write a Review</h3>
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
                <button
                  className={`${styles.button} ${styles.btnPrimary}`}
                  onClick={handleReviewSubmit}
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}

          {notification.message && (
            <div
              className={`${styles.alert} ${
                notification.type === 'success'
                  ? styles['alert--success']
                  : styles['alert--error']
              }`}
            >
              {notification.message}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoDetails;
