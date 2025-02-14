import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import styles from '../../styles/VideoDetail.module.css';

const VideoDetail = ({ video }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return (
      <div>
        <Header />
        <div className={styles.container}>
          <p>Video not found.</p>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>{video.title}</h1>
        <video controls className={styles.videoPlayer}>
          <source src={`/uploads/${video.filename}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className={styles.description}>{video.description}</p>
        <p className={styles.info}>Category: {video.category}</p>
        <p className={styles.info}>Privacy: {video.privacy}</p>
      </div>
    </React.Fragment>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getVideo?id=${id}`);
    const result = await response.json();

    if (response.ok && result.video) {
      return {
        props: {
          video: result.video,
        },
      };
    } else {
      return {
        props: {
          video: null,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching video:', error);
    return {
      props: {
        video: null,
      },
    };
  }
}

export default VideoDetail;
