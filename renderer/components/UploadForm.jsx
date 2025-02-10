import React, { useState } from 'react'
import styles from '../styles/UploadForm.module.css'

function UploadForm({ onUpload}) {
    const [video, setVideo] = useState(null)
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (video) {
            try {
                console.log('Video uploaded', video)
                const formData = new FormData()
                formData.append('video', video)

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
        <form onSubmit={handleSubmit} className='{styles.form}'>
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