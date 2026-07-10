import React, { useEffect, useRef } from 'react';

const VideoPlayer = React.memo(({ stream, muted = false }) => {
    console.log("VideoPlayer Render");
    const videoRef = useRef();

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        console.log("Video element", video);
        console.log("Current srcObject", video.srcObject);

        video.onloadedmetadata = (e) => {
            console.log("video.onloadedmetadata fired", e);
            console.log("videoWidth onloadedmetadata", video.videoWidth);
            console.log("videoHeight onloadedmetadata", video.videoHeight);
        };
        video.onloadeddata = (e) => {
            console.log("video.onloadeddata fired", e);
        };
        video.oncanplay = (e) => {
            console.log("video.oncanplay fired", e);
        };
        video.onplaying = (e) => {
            console.log("video.onplaying fired", e);
        };
        video.onerror = (e) => {
            console.error("video.onerror fired", e);
        };

        if (stream) {
            if (video.srcObject !== stream) {
                video.srcObject = stream;
                console.log("srcObject === stream", video.srcObject === stream);
                console.log("videoWidth", video.videoWidth);
                console.log("videoHeight", video.videoHeight);
                video.play().catch(console.error);
            }
        }

        return () => {
            video.onloadedmetadata = null;
            video.onloadeddata = null;
            video.oncanplay = null;
            video.onplaying = null;
            video.onerror = null;
        };
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
