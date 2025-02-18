import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [videoToDelete, setVideoToDelete] = useState(null);
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

  const handleDelete = (id) => {
    setVideoToDelete(id);
    setNotification({ message: 'Are you sure you want to delete this video?', type: 'warning' });
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;
  
    try {
      const response = await fetch('/api/deleteVideos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: videoToDelete }),
      });
  
      const result = await response.json();
      if (response.ok) {
        setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoToDelete));
        setNotification({ message: 'Video deleted successfully!', type: 'success' });
      } else {
        console.error('Failed to delete video:', result.error);
        setNotification({ message: 'Failed to delete video.', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      setNotification({ message: 'An error occurred while deleting the video.', type: 'error' });
    } finally {
      setVideoToDelete(null);
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };
  
  const cancelDelete = () => {
    setVideoToDelete(null);
    setNotification({ message: '', type: '' });
  };

  const handleVideoClick = (id) => {
    router.push(`/video/${id}`);
  };

  return (
    <>
      <Header />
      <div className={styles.alertContainer}>
        {notification.message && (
          <div
            className={`${styles.alert} ${
              notification.type === 'success'
                ? styles['alert--success']
                : notification.type === 'error'
                ? styles['alert--error']
                : notification.type === 'warning'
                ? styles['alert--warning']
                : ''
            }`}
          >
            {notification.message}
            {notification.type === 'warning' && (
              <div className={styles.notificationActions}>
                <button onClick={confirmDelete} className={styles.confirmButton}>
                  Yes
                </button>
                <button onClick={cancelDelete} className={styles.cancelButton}>
                  No
                </button>
              </div>
            )}
          </div>
        )}
      </div>
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
