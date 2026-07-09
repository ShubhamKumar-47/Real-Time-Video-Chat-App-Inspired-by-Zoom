import React, { useEffect, useRef, useState, useContext } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button, Grid, Stack, Box, Typography, Paper } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import ShareIcon from '@mui/icons-material/Share'
import server from '../environment';
import { AuthContext } from '../contexts/AuthContext';

const server_url = server;

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
    const { userData } = useContext(AuthContext);

    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();
    const connectionsRef = useRef({});

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState(true);
    let [audio, setAudio] = useState(true);
    let [screen, setScreen] = useState(false);
    let [showModal, setModal] = useState(false);
    let [screenAvailable, setScreenAvailable] = useState(false);
    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    const videoRef = useRef([])
    const chatEndRef = useRef();
    let [videos, setVideos] = useState([])

    // Auto scroll chat to bottom when messages update
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Pre-fill username from authenticated user data if available
    useEffect(() => {
        if (userData && userData.name) {
            setUsername(userData.name);
        }
    }, [userData]);

    // Single permission check & local stream setup
    const getPermissions = async () => {
        try {
            const userMediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            
            if (userMediaStream) {
                setVideoAvailable(true);
                setAudioAvailable(true);
                window.localStream = userMediaStream;
                if (localVideoref.current) {
                    localVideoref.current.srcObject = userMediaStream;
                }
            }
        } catch (error) {
            console.log("Could not obtain both audio and video, trying fallback:", error);
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setVideoAvailable(true);
                setAudioAvailable(false);
                window.localStream = videoStream;
                if (localVideoref.current) {
                    localVideoref.current.srcObject = videoStream;
                }
            } catch (err2) {
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    setVideoAvailable(false);
                    setAudioAvailable(true);
                    window.localStream = audioStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = audioStream;
                    }
                } catch (err3) {
                    console.log("No audio/video devices accessible:", err3);
                    setVideoAvailable(false);
                    setAudioAvailable(false);
                }
            }
        }

        if (navigator.mediaDevices.getDisplayMedia) {
            setScreenAvailable(true);
        } else {
            setScreenAvailable(false);
        }
    };

    useEffect(() => {
        getPermissions();

        // Cleanup on unmount
        return () => {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
                window.localStream = null;
            }
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (connectionsRef.current) {
                Object.keys(connectionsRef.current).forEach(id => {
                    connectionsRef.current[id].close();
                });
                connectionsRef.current = {};
            }
        };
    }, []);

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .catch((e) => console.log(e))
            }
        }
    }

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        
        // Ensure local stream matches chosen controls
        if (window.localStream) {
            window.localStream.getVideoTracks().forEach(track => track.enabled = videoAvailable);
            window.localStream.getAudioTracks().forEach(track => track.enabled = audioAvailable);
        }
        
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream
        }

        for (let id in connectionsRef.current) {
            if (id === socketIdRef.current) continue

            connectionsRef.current[id].addStream(window.localStream)

            connectionsRef.current[id].createOffer().then((description) => {
                connectionsRef.current[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connectionsRef.current[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            if (localVideoref.current) {
                localVideoref.current.srcObject = window.localStream
            }

            for (let id in connectionsRef.current) {
                connectionsRef.current[id].addStream(window.localStream)

                connectionsRef.current[id].createOffer().then((description) => {
                    connectionsRef.current[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connectionsRef.current[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    let getDislayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream
        }

        for (let id in connectionsRef.current) {
            if (id === socketIdRef.current) continue

            connectionsRef.current[id].addStream(window.localStream)

            connectionsRef.current[id].createOffer().then((description) => {
                connectionsRef.current[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connectionsRef.current[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            if (localVideoref.current) {
                localVideoref.current.srcObject = window.localStream
            }

            getUserMedia()
        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connectionsRef.current[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connectionsRef.current[fromId].createAnswer().then((description) => {
                            connectionsRef.current[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connectionsRef.current[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connectionsRef.current[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    connectionsRef.current[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    
                    // Wait for their ice candidate       
                    connectionsRef.current[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connectionsRef.current[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connectionsRef.current[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connectionsRef.current[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connectionsRef.current) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connectionsRef.current[id2].addStream(window.localStream)
                        } catch (e) { }

                        connectionsRef.current[id2].createOffer().then((description) => {
                            connectionsRef.current[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connectionsRef.current[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        const newValue = !video;
        setVideo(newValue);
        if (window.localStream) {
            window.localStream.getVideoTracks().forEach(track => track.enabled = newValue);
        }
    }
    
    let handleAudio = () => {
        const newValue = !audio;
        setAudio(newValue);
        if (window.localStream) {
            window.localStream.getAudioTracks().forEach(track => track.enabled = newValue);
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])

    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        if (!message.trim()) return;
        socketRef.current.emit('chat-message', message, username)
        setMessage("");
    }

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    return (
        <div className={styles.meetVideoContainer}>
            {askForUsername === true ? (
                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyCard}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <video className={styles.lobbyVideoPreview} ref={localVideoref} autoPlay muted></video>
                                    <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2, zIndex: 10 }}>
                                        <IconButton 
                                            onClick={() => setVideoAvailable(!videoAvailable)}
                                            sx={{ bgcolor: videoAvailable ? 'rgba(109,74,255,0.85)' : 'rgba(239,68,68,0.85)', color: '#fff', '&:hover': { bgcolor: videoAvailable ? '#6D4AFF' : '#DC2626' } }}
                                        >
                                            {videoAvailable ? <VideocamIcon /> : <VideocamOffIcon />}
                                        </IconButton>
                                        <IconButton 
                                            onClick={() => setAudioAvailable(!audioAvailable)}
                                            sx={{ bgcolor: audioAvailable ? 'rgba(109,74,255,0.85)' : 'rgba(239,68,68,0.85)', color: '#fff', '&:hover': { bgcolor: audioAvailable ? '#6D4AFF' : '#DC2626' } }}
                                        >
                                            {audioAvailable ? <MicIcon /> : <MicOffIcon />}
                                        </IconButton>
                                    </Box>
                                </div>
                            </Grid>
                            
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', mb: 1 }}>Join Lobby</Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.5 }}>
                                            Pre-configure your mic and camera settings, enter your call nickname, and step in.
                                        </Typography>
                                    </Box>
                                    <TextField 
                                        fullWidth 
                                        label="Meeting Nickname" 
                                        value={username} 
                                        onChange={e => setUsername(e.target.value)} 
                                        variant="outlined" 
                                        InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
                                        InputProps={{ style: { color: '#fff', borderRadius: 12 } }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                                '&.Mui-focused fieldset': { borderColor: '#6D4AFF' }
                                            }
                                        }}
                                    />
                                    <Button 
                                        variant="contained" 
                                        onClick={connect}
                                        disabled={!username.trim()}
                                        sx={{ py: 1.5, minHeight: 48, borderRadius: '10px', fontWeight: 800, background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)' }}
                                    >
                                        Connect Room
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            ) : (
                <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                    <div className={styles.meetLayout}>
                        {/* Conference Video tiles */}
                        <div className={styles.conferenceView}>
                            {videos.map((video) => (
                                <div key={video.socketId} className={styles.videoCard}>
                                    <video
                                        data-socket={video.socketId}
                                        ref={ref => {
                                            if (ref && video.stream) {
                                                ref.srcObject = video.stream;
                                            }
                                        }}
                                        autoPlay
                                    ></video>
                                    <div className={styles.participantName}>
                                        Participant ({video.socketId.substring(0, 5)})
                                    </div>
                                </div>
                            ))}
                            {videos.length === 0 && (
                                <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', p: 4 }}>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, fontWeight: 600 }}>
                                        Waiting for other participants to join...
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, mt: 1 }}>
                                        Share your current browser URL with others to invite them.
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<ShareIcon />}
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            alert("Invite link copied to clipboard!");
                                        }}
                                        sx={{ 
                                            mt: 2.5, 
                                            color: '#38BDF8', 
                                            borderColor: 'rgba(56,189,248,0.4)',
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            '&:hover': {
                                                borderColor: '#38BDF8',
                                                bgcolor: 'rgba(56,189,248,0.08)'
                                            }
                                        }}
                                    >
                                        Copy Invite Link
                                    </Button>
                                </Box>
                            )}
                        </div>

                        {/* Local PIP Video */}
                        <div className={styles.localFloatingCard}>
                            <video ref={localVideoref} autoPlay muted></video>
                            <div className={styles.participantName}>You ({username})</div>
                        </div>

                        {/* Slideout Chat Room */}
                        {showModal && (
                            <div className={styles.chatRoom}>
                                <div className={styles.chatContainer}>
                                    <div className={styles.chatHeader}>Room Chat</div>

                                    <div className={styles.chattingDisplay}>
                                        {messages.length !== 0 ? messages.map((item, index) => (
                                            <div className={styles.chatMessage} key={index}>
                                                <div className={styles.messageSender}>{item.sender}</div>
                                                <div className={styles.messageContent}>{item.data}</div>
                                            </div>
                                        )) : (
                                            <Typography sx={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', mt: 4, fontSize: 14 }}>
                                                No messages yet
                                            </Typography>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>

                                    <div className={styles.chattingArea}>
                                        <TextField 
                                            value={message} 
                                            onChange={(e) => setMessage(e.target.value)} 
                                            placeholder="Type a message..." 
                                            variant="outlined" 
                                            size="small"
                                            className={styles.chatInput}
                                            InputProps={{ style: { color: '#fff', borderRadius: 8 } }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                                    '&.Mui-focused fieldset': { borderColor: '#6D4AFF' }
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    sendMessage();
                                                }
                                            }}
                                        />
                                        <Button 
                                            variant='contained' 
                                            onClick={sendMessage}
                                            disabled={!message.trim()}
                                            sx={{ borderRadius: 2, px: 2, fontWeight: 700, bgcolor: '#6D4AFF', '&:hover': { bgcolor: '#5B3FE6' } }}
                                        >
                                            Send
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Control Toolbar */}
                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} className={styles.controlButton}>
                            {video === true ? <VideocamIcon /> : <VideocamOffIcon sx={{ color: '#EF4444' }} />}
                        </IconButton>
                        <IconButton onClick={handleAudio} className={styles.controlButton}>
                            {audio === true ? <MicIcon /> : <MicOffIcon sx={{ color: '#EF4444' }} />}
                        </IconButton>

                        <IconButton onClick={handleEndCall} className={styles.endCallButton}>
                            <CallEndIcon />
                        </IconButton>

                        {screenAvailable === true && (
                            <IconButton onClick={handleScreen} className={styles.controlButton}>
                                {screen === true ? <ScreenShareIcon sx={{ color: '#10B981' }} /> : <StopScreenShareIcon />}
                            </IconButton>
                        )}

                        <Badge badgeContent={newMessages} max={99} color="primary">
                            <IconButton onClick={() => { setModal(!showModal); setNewMessages(0); }} className={styles.controlButton}>
                                <ChatIcon />
                            </IconButton>
                        </Badge>

                        <IconButton 
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Invite link copied to clipboard!");
                            }} 
                            className={styles.controlButton}
                            title="Copy Invite Link"
                        >
                            <ShareIcon />
                        </IconButton>
                    </div>
                </div>
            )}
        </div>
    )
}