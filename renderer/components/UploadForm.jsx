import React, { useState, useRef } from 'react';
import styles from '../styles/UploadForm.module.css';

function UploadForm({ onUpload }) {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isUploading, setIsUploading] = useState(false);
  const titleInputRef = useRef(null);

  const categories = [
    'Education',
    'Entertainment',
    'Music',
    'Sports',
    'Technology',
    'Other',
  ];

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideo(file);
      setNotification({ message: '', type: '' });
    } else {
      setVideo(null);
      setNotification({ message: 'Please select a valid video file.', type: 'error' });
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnail(file);
      setNotification({ message: '', type: '' });
    } else {
      setThumbnail(null);
      setNotification({ message: 'Please select a valid image file.', type: 'error' });
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      setNotification({ message: 'Title is required.', type: 'error' });
      return false;
    }
    if (!description.trim()) {
      setNotification({ message: 'Description is required.', type: 'error' });
      return false;
    }
    if (!category.trim()) {
      setNotification({ message: 'Please select a category.', type: 'error' });
      return false;
    }
    if (!video) {
      setNotification({ message: 'Please select a valid video file.', type: 'error' });
      return false;
    }
    if (!thumbnail) {
      setNotification({ message: 'Please select a valid thumbnail image.', type: 'error' });
      return false;
    }
    if (!['public', 'private'].includes(privacy)) {
      setNotification({ message: 'Please select a valid privacy option.', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: '', type: '' });

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', video);
      formData.append('thumbnail', thumbnail);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category.trim());
      formData.append('privacy', privacy);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setNotification({ message: 'Video uploaded successfully!', type: 'success' });
        onUpload(result.video);

        setVideo(null);
        setThumbnail(null);
        setTitle('');
        setDescription('');
        setCategory('');
        setPrivacy('public');
      } else {
        setNotification({ message: result.error || 'Failed to upload video.', type: 'error' });
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setNotification({ message: 'An error occurred while uploading the video.', type: 'error' });
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setNotification({ message: '', type: '' });
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }, 3000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="title">
          <span>Title:</span>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            ref={titleInputRef}
          />
        </label>

        <label htmlFor="description">
          <span>Description:</span>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label htmlFor="category">
          <span>Category:</span>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="thumbnail">
          <span>Thumbnail:</span>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
          />
          {thumbnail && <p>Selected file: {thumbnail.name}</p>}
        </label>

        <label htmlFor="privacy">
          <span>Privacy:</span>
          <select
            id="privacy"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            required
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>

        <label htmlFor="video">
          <span>Upload a video:</span>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            required
          />
          {video && <p>Selected file: {video.name}</p>}
        </label>

        <div className={styles.uploadInstructions}>
          <p>For best results, please upload videos and images with a 16:9 aspect ratio.</p>
        </div>

        {notification.message && (
          <p
            className={`${styles.alert} ${
              notification.type === 'success'
                ? styles['alert--success']
                : styles['alert--error']
            }`}
          >
            {notification.message}
          </p>
        )}

        <button
          type="submit"
          className={styles.uploadButton}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

export default UploadForm;
