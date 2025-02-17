import React, { useState, useRef } from 'react';
import styles from '../styles/UploadForm.module.css';

function UploadForm({ onUpload }) {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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
      setError('');
    } else {
      setVideo(null);
      setError('Please select a valid video file.');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnail(file);
      setError('');
    } else {
      setThumbnail(null);
      setError('Please select a valid image file.');
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Title is required.');
      return false;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return false;
    }
    if (!category.trim()) {
      setError('Please select a category.');
      return false;
    }
    if (!video) {
      setError('Please select a valid video file.');
      return false;
    }
    if (!thumbnail) {
      setError('Please select a valid thumbnail image.');
      return false;
    }
    if (!['public', 'private'].includes(privacy)) {
      setError('Please select a valid privacy option.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

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
        setMessage('Video uploaded successfully!');
        onUpload(result.video);

        // Reset form fields
        setVideo(null);
        setThumbnail(null);
        setTitle('');
        setDescription('');
        setCategory('');
        setPrivacy('public');
      } else {
        setError(result.error || 'Failed to upload video.');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('An error occurred while uploading the video.');
    } finally {
      setIsUploading(false);
      titleInputRef.current.focus();
    }
  };

  return (
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

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.uploadInstructions}>
        <p>For best results, please upload videos and images with a 16:9 aspect ratio.</p>
      </div>

      <button
        type="submit"
        className={styles.uploadButton}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}

export default UploadForm;
