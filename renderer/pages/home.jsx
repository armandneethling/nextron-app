import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/listVideos', { cache: 'no-store' });
        if (!response.ok) {
          console.error('Failed to fetch videos:', response.statusText);
          return;
        }
        const result = await response.json();
        if (Array.isArray(result.videos)) {
          setVideos(result.videos);
        } else {
          console.error('Unexpected response format', result);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this video?');
    if (!confirmed) return;

    try {
      const response = await fetch('/api/deleteVideos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (response.ok) {
        setVideos(videos.filter((video) => video.id !== id));
        setNotification({ message: 'Video deleted successfully!', type: 'success' });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      } else {
        console.error('Failed to delete video:', result.error);
        setNotification({ message: 'Failed to delete video.', type: 'error' });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      setNotification({ message: 'An error occurred while deleting the video.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  const handleVideoClick = (id) => {
    router.push(`/video/${id}`);
  };

  return (
    <>
      <Header />
      {notification.message && (
        <div className={`${styles.alert} ${notification.type === 'success' ? styles['alert--success'] : styles['alert--error']}`}>
          {notification.message}
        </div>
      )}
      <div className={styles.container}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <div
              key={video.id}
              className={styles.videoCard}
              onClick={() => handleVideoClick(video.id)}
            >
              <div className={styles.thumbnailWrapper}>
                <img
                  src={`/uploads/${video.thumbnail}`}
                  alt="Thumbnail"
                  className={styles.thumbnail}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(video.id);
                  }}
                  className={styles.deleteButton}
                  title="Delete Video"
                >
                  &#10006;
                </button>
              </div>
              <p className={styles.videoTitle}>{video.title}</p>
            </div>
          ))
        ) : (
          <p>No videos uploaded</p>
        )}
      </div>
    </>
  );
}
