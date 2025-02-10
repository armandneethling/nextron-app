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
      const response = await fetch(`/api/deleteVideo?filename=${video}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setVideos(videos.filter(v => v.filename !== video.filename));
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
        <h1>Uploaded Videos</h1>
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <div key={index}>
              <VideoDisplay key={index} videoSrc={video.filename} onDelete={handleDelete}/>
              <div>
                <h2>{video.title}</h2>
                <p>{video.description}</p>
                <p>Category: {video.category}</p>
                <p>Privacy: {video.privacy}</p>
                {video.thumbnail && (
                  <Image src={`/videos/${video.thumbnail}`} alt="Thumbnail" width={200} height={150} />
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No video uploaded</p>
        )}
      </div>
    </React.Fragment>
  )
}
