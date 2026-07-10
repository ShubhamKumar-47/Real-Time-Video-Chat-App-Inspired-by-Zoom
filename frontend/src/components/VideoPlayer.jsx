import React, { useEffect, useRef } from 'react';

const VideoPlayer = React.memo(({ stream, muted = false }) => {
    console.log("VideoPlayer Render");
    const videoRef = useRef();

    useEffect(() => {
        if (videoRef.current && stream) {
            if (videoRef.current.srcObject !== stream) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch(console.error);
            }
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
});

export default VideoPlayer;
