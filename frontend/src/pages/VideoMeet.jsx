import React, { useEffect, useRef, useState, useContext } from 'react';
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button, Grid, Stack, Box, Typography } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import ShareIcon from '@mui/icons-material/Share';
import server from '../environment';
import { AuthContext } from '../contexts/AuthContext';
import VideoPlayer from '../components/VideoPlayer';

const server_url = server;

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
};

function silence() {
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
}

function black({ width = 640, height = 480 } = {}) {
    let canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext('2d').fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
}

export default function VideoMeetComponent() {
    console.log("VideoMeet Render");
    const { userData } = useContext(AuthContext);

    const socketRef = useRef(null);
    const socketIdRef = useRef(null);

    const peerConnections = useRef(new Map());
    const remoteStreams = useRef(new Map());
    const makingOfferRef = useRef(new Map());
    const pendingCandidatesRef = useRef(new Map());

    const [localStreamCounter, setLocalStreamCounter] = useState(0);
    const [participants, setParticipants] = useState([]);

    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);
    const [showModal, setModal] = useState(false);
    const [screenAvailable, setScreenAvailable] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");

    const chatEndRef = useRef(null);

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
                remoteStreams.current.set('local', userMediaStream);
                setLocalStreamCounter(c => c + 1);
            }
        } catch (error) {
            console.log("Could not obtain both audio and video, trying fallback:", error);
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setVideoAvailable(true);
                setAudioAvailable(false);
                window.localStream = videoStream;
                remoteStreams.current.set('local', videoStream);
                setLocalStreamCounter(c => c + 1);
            } catch (err2) {
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    setVideoAvailable(false);
                    setAudioAvailable(true);
                    window.localStream = audioStream;
                    remoteStreams.current.set('local', audioStream);
                    setLocalStreamCounter(c => c + 1);
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

        return () => {
            cleanMeetingResources();
        };
    }, []);

    const cleanMeetingResources = () => {
        if (window.localStream) {
            window.localStream.getTracks().forEach(track => track.stop());
            window.localStream = null;
        }

        peerConnections.current.forEach((pc) => {
            pc.ontrack = null;
            pc.onicecandidate = null;
            pc.onconnectionstatechange = null;
            pc.oniceconnectionstatechange = null;
            pc.onnegotiationneeded = null;
            pc.close();
        });
        peerConnections.current.clear();
        remoteStreams.current.clear();
        makingOfferRef.current.clear();
        pendingCandidatesRef.current.clear();

        if (socketRef.current) {
            socketRef.current.off();
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    };

    const runStatsAudit = async (socketListId) => {
        try {
            const pc = peerConnections.current.get(socketListId);
            if (!pc) return;
            
            const stats = await pc.getStats();
            console.log(`--- WEBRTC ICE STATS AUDIT FOR ${socketListId} ---`);
            console.log("ICE Connection State:", pc.iceConnectionState);
            console.log("Connection State:", pc.connectionState);
            console.log("Signaling State:", pc.signalingState);
            
            let selectedPairReport = null;
            const candidateReports = new Map();

            stats.forEach(report => {
                if (report.type === 'candidate-pair' && report.selected) {
                    selectedPairReport = report;
                }
                if (report.type === 'local-candidate' || report.type === 'remote-candidate') {
                    candidateReports.set(report.id, report);
                }
            });

            if (selectedPairReport) {
                const localCand = candidateReports.get(selectedPairReport.localCandidateId);
                const remoteCand = candidateReports.get(selectedPairReport.remoteCandidateId);

                console.log("[Selected Candidate Pair Stats]:", {
                    state: selectedPairReport.state,
                    localCandidateType: localCand?.candidateType,
                    localIp: localCand?.ip || localCand?.address,
                    localPort: localCand?.port,
                    remoteCandidateType: remoteCand?.candidateType,
                    remoteIp: remoteCand?.ip || remoteCand?.address,
                    remotePort: remoteCand?.port,
                    relayProtocol: selectedPairReport.relayProtocol || "None",
                    requestsSent: selectedPairReport.requestsSent,
                    responsesReceived: selectedPairReport.responsesReceived
                });
            } else {
                console.log("No selected candidate pair found yet. Checking general candidate pair statuses...");
                stats.forEach(report => {
                    if (report.type === 'candidate-pair') {
                        console.log(`Candidate Pair ${report.id} state: ${report.state}, localId: ${report.localCandidateId}, remoteId: ${report.remoteCandidateId}`);
                    }
                });
            }
            console.log(`-----------------------------------------------`);
        } catch (err) {
            console.error("Stats audit error:", err);
        }
    };

    const getOrCreatePeerConnection = (socketListId) => {
        if (peerConnections.current.has(socketListId)) {
            return peerConnections.current.get(socketListId);
        }

        console.log("RTCPeerConnection ICE configuration:", peerConfigConnections);
        const pc = new RTCPeerConnection(peerConfigConnections);
        peerConnections.current.set(socketListId, pc);

        pc.onconnectionstatechange = () => {
            console.log(`[Connection State Change] ${socketListId}:`, pc.connectionState);
            if (pc.connectionState === "connected" || pc.connectionState === "failed" || pc.connectionState === "disconnected") {
                runStatsAudit(socketListId);
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log(`[ICE Connection State Change] ${socketListId}:`, pc.iceConnectionState);
        };

        pc.onicegatheringstatechange = () => {
            console.log(`[ICE Gathering State Change] ${socketListId}:`, pc.iceGatheringState);
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log(`[${new Date().toISOString()}] ICE Sent to socketId: ${socketListId}`);
                console.log(`[ICE Candidate Generated] Sending candidate to ${socketListId}:`, {
                    candidate: event.candidate.candidate,
                    sdpMid: event.candidate.sdpMid,
                    sdpMLineIndex: event.candidate.sdpMLineIndex
                });
                
                // Parse candidate components
                const parts = event.candidate.candidate.split(' ');
                if (parts.length >= 8) {
                    const type = parts[7];
                    const protocol = parts[2];
                    const address = parts[4];
                    const port = parts[5];
                    console.log(`Parsed local candidate components: type=${type}, protocol=${protocol}, address=${address}, port=${port}`);
                }

                socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
            } else {
                console.log(`[ICE Candidate Generation Complete] for ${socketListId}`);
            }
        };

        pc.ontrack = (event) => {
            console.log(`[${new Date().toISOString()}] ontrack event for ${socketListId}`);
            console.log("event.track.kind", event.track.kind);
            console.log("event.streams.length", event.streams ? event.streams.length : 0);
            console.log("event.streams", event.streams);
            console.log("event.streams[0]", event.streams ? event.streams[0] : null);
            console.log("event.track.id", event.track.id);
            console.log("event.track.muted", event.track.muted);
            console.log("event.track.readyState", event.track.readyState);
            
            let remoteStream = event.streams && event.streams[0];
            if (remoteStream) {
                remoteStreams.current.set(socketListId, remoteStream);
            } else {
                if (!remoteStreams.current.has(socketListId)) {
                    remoteStreams.current.set(socketListId, new MediaStream());
                }
                remoteStream = remoteStreams.current.get(socketListId);
                if (event.track) {
                    if (!remoteStream.getTracks().find(t => t.id === event.track.id)) {
                        remoteStream.addTrack(event.track);
                    }
                }
            }

            setParticipants(prev => {
                const exists = prev.find(p => p.socketId === socketListId);
                if (exists) {
                    return prev;
                } else {
                    return [...prev, { socketId: socketListId, isLocal: false, username: socketListId }];
                }
            });
        };

        pc.onnegotiationneeded = async () => {
            if (!pc.isOfferer) {
                console.log(`[onnegotiationneeded] Ignoring offer creation for ${socketListId} because we are the answerer.`);
                return;
            }
            try {
                if (makingOfferRef.current.get(socketListId) || pc.signalingState !== 'stable') {
                    return;
                }
                makingOfferRef.current.set(socketListId, true);

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                console.log(`[${new Date().toISOString()}] Offer Sent to socketId: ${socketListId}`);
                socketRef.current.emit('signal', socketListId, JSON.stringify({ 'sdp': pc.localDescription }));
            } catch (err) {
                console.error(`Negotiation error for ${socketListId}:`, err);
            } finally {
                makingOfferRef.current.set(socketListId, false);
            }
        };

        return pc;
    };

    const gotMessageFromServer = async (fromId, message) => {
        const signal = JSON.parse(message);
        if (fromId === socketIdRef.current) return;

        const pc = getOrCreatePeerConnection(fromId);

        try {
            if (signal.sdp) {
                const desc = new RTCSessionDescription(signal.sdp);
                
                if (desc.type === 'offer') {
                    console.log(`[${new Date().toISOString()}] Offer Received from socketId: ${fromId}`);
                } else if (desc.type === 'answer') {
                    console.log(`[${new Date().toISOString()}] Answer Received from socketId: ${fromId}`);
                }

                // Never process the same SDP twice
                if (pc.remoteDescription && pc.remoteDescription.sdp === desc.sdp) {
                    console.log(`[${new Date().toISOString()}] Duplicate SDP Ignored. Already set as remoteDescription. Socket ID: ${fromId}`);
                    return;
                }

                // If it is an answer, ignore it if we are not in the "have-local-offer" state
                if (desc.type === 'answer') {
                    if (pc.signalingState !== 'have-local-offer') {
                        console.log(`[${new Date().toISOString()}] Answer Ignored from socketId: ${fromId} (state is ${pc.signalingState}, expected have-local-offer)`);
                        return;
                    }
                }

                await pc.setRemoteDescription(desc);

                // Flush pending candidates now that remoteDescription exists
                const pending = pendingCandidatesRef.current.get(fromId) || [];
                for (const candidate of pending) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                        console.log(`[${new Date().toISOString()}] Buffered ICE Candidate Added successfully for socketId: ${fromId}`);
                    } catch (err) {
                        console.error(`[${new Date().toISOString()}] Buffered ICE Candidate Addition Failed for socketId: ${fromId}:`, err);
                    }
                }
                pending.length = 0;

                if (desc.type === 'offer') {
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    console.log(`[${new Date().toISOString()}] Answer Sent to socketId: ${fromId}`);
                    socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': pc.localDescription }));
                }
            } else if (signal.ice) {
                console.log(`[${new Date().toISOString()}] ICE Received from socketId: ${fromId}`);
                
                const pending = pendingCandidatesRef.current.get(fromId) || [];
                if (!pendingCandidatesRef.current.has(fromId)) {
                    pendingCandidatesRef.current.set(fromId, pending);
                }

                if (!pc.remoteDescription) {
                    console.log(`[${new Date().toISOString()}] remoteDescription is null for socketId: ${fromId}. Buffering ICE candidate.`);
                    pending.push(signal.ice);
                } else {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(signal.ice));
                        console.log(`[${new Date().toISOString()}] ICE Candidate Added Successfully for socketId: ${fromId}`);
                    } catch (err) {
                        console.error(`[${new Date().toISOString()}] ICE Candidate Addition Failed for socketId: ${fromId}:`, err);
                    }
                }
            }
        } catch (err) {
            console.error(`Error processing signaling message from ${fromId}:`, err);
        }
    };

    const connectToSocketServer = () => {
        if (socketRef.current) {
            socketRef.current.off();
            socketRef.current.disconnect();
        }
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage);

            socketRef.current.on('user-left', (id) => {
                setParticipants((prev) => prev.filter((p) => p.socketId !== id));

                if (peerConnections.current.has(id)) {
                    peerConnections.current.get(id).close();
                    peerConnections.current.delete(id);
                }
                remoteStreams.current.delete(id);
                makingOfferRef.current.delete(id);
            });

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    if (socketListId === socketIdRef.current) return;

                    const pc = getOrCreatePeerConnection(socketListId);

                    if (window.localStream) {
                        window.localStream.getTracks().forEach(track => {
                            const senders = pc.getSenders();
                            const alreadyAdded = senders.some(s => s.track === track);
                            if (!alreadyAdded) {
                                pc.addTrack(track, window.localStream);
                            }
                        });
                    }

                    if (id !== socketIdRef.current && socketListId === id) {
                        pc.isOfferer = true;
                    } else {
                        pc.isOfferer = false;
                    }
                });
            });
        });
    };

    const getUserMediaSuccess = (stream) => {
        window.localStream = stream;
        remoteStreams.current.set('local', stream);
        setLocalStreamCounter(c => c + 1);

        setParticipants(prev => {
            const exists = prev.find(p => p.isLocal);
            if (exists) {
                return prev;
            } else {
                return [...prev, { socketId: 'local', isLocal: true, username: username || 'You' }];
            }
        });

        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];

        peerConnections.current.forEach((pc) => {
            const senders = pc.getSenders();

            if (videoTrack) {
                const videoSender = senders.find(s => s.track && s.track.kind === 'video');
                if (videoSender) {
                    videoSender.replaceTrack(videoTrack).catch(e => console.error("replaceTrack video error:", e));
                } else {
                    pc.addTrack(videoTrack, stream);
                }
            }

            if (audioTrack) {
                const audioSender = senders.find(s => s.track && s.track.kind === 'audio');
                if (audioSender) {
                    audioSender.replaceTrack(audioTrack).catch(e => console.error("replaceTrack audio error:", e));
                } else {
                    pc.addTrack(audioTrack, stream);
                }
            }
        });

        stream.getTracks().forEach(track => {
            track.onended = () => {
                setVideo(false);
                setAudio(false);

                if (window.localStream) {
                    window.localStream.getTracks().forEach(t => t.stop());
                }

                const fallbackStream = new MediaStream([black(), silence()]);
                window.localStream = fallbackStream;
                remoteStreams.current.set('local', fallbackStream);
                setLocalStreamCounter(c => c + 1);

                const fallbackVideo = fallbackStream.getVideoTracks()[0];
                const fallbackAudio = fallbackStream.getAudioTracks()[0];

                peerConnections.current.forEach((pc) => {
                    const senders = pc.getSenders();
                    
                    if (fallbackVideo) {
                        const videoSender = senders.find(s => s.track && s.track.kind === 'video');
                        if (videoSender) {
                            videoSender.replaceTrack(fallbackVideo).catch(e => console.error(e));
                        } else {
                            pc.addTrack(fallbackVideo, fallbackStream);
                        }
                    }

                    if (fallbackAudio) {
                        const audioSender = senders.find(s => s.track && s.track.kind === 'audio');
                        if (audioSender) {
                            audioSender.replaceTrack(fallbackAudio).catch(e => console.error(e));
                        } else {
                            pc.addTrack(fallbackAudio, fallbackStream);
                        }
                    }
                });
            };
        });
    };

    const getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log(e));
        } else {
            try {
                if (window.localStream) {
                    window.localStream.getTracks().forEach(track => track.stop());
                }
            } catch (e) { }
        }
    };

    const getDislayMediaSuccess = (stream) => {
        window.localStream = stream;
        remoteStreams.current.set('local', stream);
        setLocalStreamCounter(c => c + 1);

        const videoTrack = stream.getVideoTracks()[0];

        peerConnections.current.forEach((pc) => {
            const senders = pc.getSenders();
            const videoSender = senders.find(s => s.track && s.track.kind === 'video');

            if (videoSender && videoTrack) {
                videoSender.replaceTrack(videoTrack).catch(e => console.error("replaceTrack screen error:", e));
            } else if (videoTrack) {
                pc.addTrack(videoTrack, stream);
            }
        });

        videoTrack.onended = () => {
            setScreen(false);
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
            getUserMedia();
        };
    };

    const getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .catch((e) => {
                        console.error(e);
                        setScreen(false);
                    });
            }
        }
    };

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen]);

    const handleVideo = () => {
        const newValue = !video;
        setVideo(newValue);
        if (window.localStream) {
            window.localStream.getVideoTracks().forEach(track => track.enabled = newValue);
        }
    };

    const handleAudio = () => {
        const newValue = !audio;
        setAudio(newValue);
        if (window.localStream) {
            window.localStream.getAudioTracks().forEach(track => track.enabled = newValue);
        }
    };

    const handleScreen = () => {
        setScreen(!screen);
    };

    const handleEndCall = () => {
        cleanMeetingResources();
        window.location.href = "/";
    };

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    const sendMessage = () => {
        if (!message.trim()) return;
        socketRef.current.emit('chat-message', message, username);
        setMessage("");
    };

    const connect = () => {
        setAskForUsername(false);
        if (window.localStream) {
            remoteStreams.current.set('local', window.localStream);
        }
        setParticipants([{ socketId: 'local', isLocal: true, username: username || 'You' }]);
        
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        
        if (window.localStream) {
            window.localStream.getVideoTracks().forEach(track => track.enabled = videoAvailable);
            window.localStream.getAudioTracks().forEach(track => track.enabled = audioAvailable);
        }
        
        connectToSocketServer();
    };

    return (
        <div className={styles.meetVideoContainer} style={askForUsername ? { height: 'auto', minHeight: '100vh', overflow: 'auto' } : {}}>
            {askForUsername === true ? (
                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyCard}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <div className={styles.lobbyVideoPreview}>
                                        <VideoPlayer stream={remoteStreams.current.get('local')} muted={true} />
                                    </div>
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
                            {console.log("Participants Render")}
                            {participants.filter(p => !p.isLocal).map((participant) => (
                                <div key={participant.socketId} className={styles.videoCard}>
                                    <VideoPlayer key={participant.socketId} stream={remoteStreams.current.get(participant.socketId)} muted={false} />
                                    <div className={styles.participantName}>
                                        Participant ({participant.socketId.substring(0, 5)})
                                    </div>
                                </div>
                            ))}
                            {participants.filter(p => !p.isLocal).length === 0 && (
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
                            <VideoPlayer stream={remoteStreams.current.get('local')} muted={true} />
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
    );
}