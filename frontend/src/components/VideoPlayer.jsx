import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream, muted = false }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (stream) {
            video.srcObject = stream;
        } else {
            video.srcObject = null;
        }
    }, [stream]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    );
};

export default VideoPlayer;
