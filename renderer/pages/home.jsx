import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

export default function HomePage() {
  const [videos, setVideos] = useState([]);
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
        alert('Video deleted successfully!');
      } else {
        console.error('Failed to delete video:', result.error);
        alert('Failed to delete video.');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('An error occurred while deleting the video.');
    }
  };

  const handleVideoClick = (id) => {
    router.push(`/video/${id}`);
  };

  return (
    <>
      <Header />
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
