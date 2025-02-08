import React, { useState } from 'react'
import styles from '../styles/UploadForm.module.css'

function UploadForm({ onUpload}) {
    const [video, setVideo] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [thumbnail, setThumbnail] = useState(null)
    const [privacy, setPrivacy] = useState('public')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideo(file);
            setError('');
        } else {
            setVideo(null);
            setError('Please select a video file');
        }
    }

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setThumbnail(file);
            setError('');
        } else {
            setThumbnail(null);
            setError('Please select an image file');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (video) {
            try {
                console.log('Video uploaded', video)
                const formData = new FormData()
                formData.append('video', video)
                formData.append('title', title)
                formData.append('description', description)
                formData.append('category', category)
                formData.append('thumbnail', thumbnail)
                formData.append('privacy', privacy)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (response.ok) {
                    setMessage('Video uploaded successfully');
                    onUpload(result.filename);
                } else {
                    setMessage('Failed to upload video');
                }
            } catch (error) {
                console.error('Error uploading video:', error);
                setMessage('An error occured while upload the video');
            }
        } else {
            console.log('Please select a video file');
            setMessage('Please select a video file');
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label>
                Title:
                <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
                Description:
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label>
                Category:
                <input type='text' value={category} onChange={(e) => setCategory(e.target.value)} />
            </label>
            <label>
                Thumbnail:
                <input type='file' accept='image/*' onChange={handleThumbnailChange} />
            </label>
            <label>
                Privacy:
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                    <option value='public'>Public</option>
                    <option value='private'>Private</option>
                </select>
            </label>
            <label>
                Upload a video:
                <input type='file' accept='video/*' onChange={handleVideoChange} />
            </label>
            {error && <p className={styles.error}>{error}</p>}
            <button type='submit'>Upload</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default UploadForm;