import React from 'react';

const VideoDisplay = ({ video, onDelete }) => {
  if (!video) {
    return <p>No video uploaded</p>;
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(video.id);
    }
  };

  return (
    <div>
      <video controls>
        <source src={`/uploads/${video.filename}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default VideoDisplay;
