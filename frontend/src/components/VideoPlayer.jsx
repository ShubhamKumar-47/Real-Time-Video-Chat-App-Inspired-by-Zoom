import React, { useEffect, useRef } from 'react';

const VideoPlayer = React.memo(({ stream, muted = false }) => {
    console.log("VideoPlayer Render");
    const videoRef = useRef();

    const prevStreamRef = useRef();
    console.log("previousStream === currentStream", prevStreamRef.current === stream);
    useEffect(() => {
        prevStreamRef.current = stream;
    });

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

        const handleTrackAdded = (e) => {
            console.log(`[VideoPlayer] Track added to stream: ${e.track.kind}`);
            video.play().catch(console.error);
        };

        if (stream) {
            stream.addEventListener('addtrack', handleTrackAdded);
            stream.addEventListener('removetrack', handleTrackAdded);

            if (video.srcObject !== stream) {
                video.srcObject = stream;
                console.log("srcObject === stream", video.srcObject === stream);
                console.log("videoWidth", video.videoWidth);
                console.log("videoHeight", video.videoHeight);
                video.play().catch(console.error);
            } else {
                video.play().catch(console.error);
            }
        }

        return () => {
            if (stream) {
                stream.removeEventListener('addtrack', handleTrackAdded);
                stream.removeEventListener('removetrack', handleTrackAdded);
            }
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
