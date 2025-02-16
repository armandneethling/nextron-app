import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/Details.module.css';
import { useRouter } from 'next/router';

const DetailsPage = () => {
  const [videos, setVideos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/listVideos', { cache: 'no-store' });
        const result = await response.json();
        if (response.ok && Array.isArray(result.videos)) {
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
                  src={`/uploads/${video.thumbnail}`} // Ensure the path is correct
                  alt="Thumbnail"
                  className={styles.thumbnail}
                />
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
};

export default DetailsPage;
