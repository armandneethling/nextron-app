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
      console.log('Fetching video with ID:', id);
      const fetchVideo = async () => {
        try {
          const response = await fetch(`/api/getVideos?id=${id}`, { cache: 'no-store' });
          if (response.ok) {
            const result = await response.json();
            console.log('Fetched video data:', result);
            setVideo(result);
          } else {
            const error = await response.text();
            console.error('Failed to fetch video:', error);
            setVideo({
              title: 'Sample Video Title',
              thumbnail: 'sample.jpg',
              filename: 'sample.mp4',
              description: 'This is a sample video description.',
              category: 'Tutorial',
              privacy: 'Public',
              duration: 120,
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error('Error fetching video:', error);
          setVideo({
            title: 'Sample Video Title',
            thumbnail: 'sample.jpg',
            filename: 'sample.mp4',
            description: 'This is a sample video description.',
            category: 'Tutorial',
            privacy: 'Public',
            duration: 120,
            createdAt: new Date(),
          });
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
        <img
          src={`/uploads/${video.thumbnail}`}
          alt={`${video.title} thumbnail`}
          className={styles.thumbnail}
        />
        <video controls className={styles.videoPlayer}>
          <source src={`/uploads/${video.filename}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className={styles.description}>{video.description}</p>
        <p className={styles.info}>Category: {video.category}</p>
        <p className={styles.info}>Privacy: {video.privacy}</p>
        <p className={styles.info}>Duration: {video.duration} seconds</p>
        <p className={styles.info}>
          Uploaded at: {new Date(video.createdAt).toLocaleString()}
        </p>
      </div>
    </>
  );
};

export default VideoDetails;
