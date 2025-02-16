import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import styles from '../../styles/VideoDetail.module.css';

const VideoDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchVideo = async () => {
        try {
          const response = await fetch(`/api/getVideo?id=${id}`, { cache: 'no-store' });
          const result = await response.json();
          if (response.ok) {
            setVideo(result);
          } else {
            console.error('Failed to fetch video:', result.error);
          }
        } catch (error) {
          console.error('Error fetching video:', error);
        }
      };
      fetchVideo();
    }
  }, [id]);

  if (!video) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>{video.title}</h1>
        <img src={video.thumbnail} alt={`${video.title} thumbnail`} className={styles.thumbnail} />
        <video controls className={styles.videoPlayer}>
          <source src={video.filename} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className={styles.description}>{video.description}</p>
        <p className={styles.info}>Category: {video.category}</p>
        <p className={styles.info}>Privacy: {video.privacy}</p>
        <p className={styles.info}>Duration: {video.duration} seconds</p>
        <p className={styles.info}>Uploaded at: {new Date(video.createdAt).toLocaleString()}</p>
      </div>
    </>
  );
};

export default VideoDetails;
