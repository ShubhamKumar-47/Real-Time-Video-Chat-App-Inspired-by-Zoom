# 🎥 Real-Time Video Chat App (Zoom Inspired)

A full-stack real-time video conferencing application inspired by Zoom. Built using WebRTC and Socket.IO to enable seamless audio and video communication directly inside the browser.

---

## 🚀 Tech Stack

### Frontend
- **React**: Modern components with memoization and hooks.
- **Material-UI (MUI)**: Styling components and lobby panels.
- **WebRTC**: Real-time peer-to-peer audio and video transmission.
- **Socket.IO Client**: Real-time signaling and chat integration.

### Backend
- **Node.js & Express**: API routing and static server.
- **MongoDB Atlas**: Database storage for user credentials and logs.
- **Socket.IO Server**: Room management and WebRTC signaling relay.

---

## 🔥 Features

- **User Authentication**: Secure user login, registration, and session state.
- **One-Click Joining**: Generate meeting rooms and invite others via browser URL sharing.
- **Real-Time Video/Audio Chat**: Full-duplex audio and video conferencing.
- **Screen Sharing**: Stream your desktop directly to other meeting participants.
- **In-Call Text Chat**: Exchange messages in real-time with full history persistence.
- **Lobby Configuration**: Test your audio and video devices before joining.

---

## 🛠️ WebRTC Architecture Optimizations

We implemented production-grade architecture improvements to the WebRTC and rendering lifecycle:

### 1️⃣ Deterministic One-Offer/One-Answer Signaling Flow
- Removed standard Perfect Negotiation rollbacks to prevent offer collisions and race conditions.
- Uses dynamic role classification during the `user-joined` socket handshake:
  - **Existing Room Peer**: Classed as the `Offerer` and initiates negotiation.
  - **Joining Room Peer**: Classed as the `Answerer` and only generates answers upon receiving offers.
- Ensures exactly one offer, one answer, and zero rollback operations per peer connection.

### 2️⃣ Metadata-Only React State
- React state variables like `participants` store **ONLY** serializable metadata (`socketId`, `isLocal`, `username`).
- Highly mutable objects like `MediaStream` are kept completely outside React state and stored exclusively inside a mutable Ref Map (`remoteStreams.current`), preventing redundant component re-renders.

### 3️⃣ Auto-Updating HTML5 Video Elements
- Video containers are wrapped in `React.memo` and keyed stably by `key={participant.socketId}` to prevent component remounting or visual flickering.
- Integrated `addtrack` and `removetrack` event listeners directly on the stream objects. This forces the browser to call `.play()` and update video layout dimensions dynamically as new tracks (e.g. video, screen sharing) are negotiated on existing streams.

---

## ⚙️ Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/ShubhamKumar-47/Real-Time-Video-Chat-App-Inspired-by-Zoom.git
cd Real-Time-Video-Chat-App-Inspired-by-Zoom
```

### 2️⃣ Install Dependencies
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### 3️⃣ Run Locally
```bash
# Start backend server (from backend folder)
npm run dev

# Start frontend Vite server (from frontend folder)
npm run dev
```
