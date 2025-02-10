import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Header from '../components/Header'
import VideoDisplay from '../components/VideoDisplay'

export default function HomePage() {
  const [videos, setVideos] = useState([])

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
        console.error('Error fetching video:', error);
      }
    };
    fetchVideos();
  }, [])

  const handleDelete = async (video) => {
    try {
      const response = await fetch(`/api/deleteVideos?filename=${video}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setVideos(videos.filter(v => v !== video));
      } else {
        console.error('Failed to delete video');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  }

  return (
    <React.Fragment>
      <Header />
      <div>
        <h1>Uploaded Video</h1>
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <VideoDisplay key={index} videoSrc={video} onDelete={handleDelete}/>
          ))
        ) : (
          <p>No video uploaded</p>
        )}
      </div>
    </React.Fragment>
  )
}
