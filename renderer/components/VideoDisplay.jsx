import React from "react";

const VideoDisplay = ({ videoSrc, onDelete }) => {
    const handleDelete = () => {
        if (onDelete) {
            onDelete(videoSrc);
        }
    }

    return (
        <div>
            {videoSrc ? (
                <div>
                    <video controls>
                        <source src={`/videos/${videoSrc}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            ) : (
                <p>No video uploaded</p>
            )}
        </div>
    );
};

export default VideoDisplay;