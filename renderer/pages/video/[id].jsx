import React from 'react';
import Header from '../../components/Header';
import styles from '../../styles/VideoDetail.module.css';

const VideoDetail = ({ video }) => {
  if (!video) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <p>Video not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>{video.title}</h1>
        <video controls className={styles.videoPlayer}>
          <source src={`/uploads/${video.filename}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {video.description && <p className={styles.description}>{video.description}</p>}
        <p className={styles.info}>Category: {video.category}</p>
        <p className={styles.info}>Privacy: {video.privacy}</p>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await fetch(`http://localhost:8888/api/getVideo?id=${id}`);
    const data = await res.json();

    if (res.ok) {
      return { props: { video: data.video } };
    } else {
      return { props: { video: null } };
    }
  } catch (error) {
    console.error('Error fetching video:', error);
    return { props: { video: null } };
  }
}

export default VideoDetail;
