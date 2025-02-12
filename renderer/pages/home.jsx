import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import styles from '../styles/Home.module.css';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/listVideos');
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

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

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

  const openModal = (video) => {
    setCurrentVideo(video);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentVideo(null);
  };

  return (
    <React.Fragment>
      <Header />
      <div className={styles.container}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.id} className={styles.videoCard}>
              <div className={styles.thumbnailWrapper}>
                <img
                  src={`/uploads/${video.thumbnail}`}
                  alt="Thumbnail"
                  className={styles.thumbnail}
                  onClick={() => openModal(video)}
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

      {currentVideo && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Video Modal"
          className={styles.modal}
          overlayClassName={styles.overlay}
          shouldCloseOnOverlayClick={true}
        >
          <div className={styles.modalContent}>
            <button onClick={closeModal} className={styles.closeButton}>
              &times;
            </button>
            <h2 className={styles.modalTitle}>{currentVideo.title}</h2>
            <video controls className={styles.modalVideo}>
              <source src={`/uploads/${currentVideo.filename}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className={styles.modalInfo}>
              <p>{currentVideo.description}</p>
              <p>Category: {currentVideo.category}</p>
              <p>Duration: {formatDuration(currentVideo.duration)}</p>
              <p>Privacy: {currentVideo.privacy}</p>
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
}
