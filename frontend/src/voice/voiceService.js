let localStream = null;
const peers = {};
const audioElements = {};

/* ---------------- INIT ---------------- */

export const initVoice = async (socket, groupId, userInfo) => {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  socket.emit("joinVoiceGroup", groupId, userInfo);

  return localStream;
};

export const getLocalStream = () => localStream;

/* ---------------- CREATE PEER ---------------- */

export const createPeer = (socket, targetId) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  // Add mic track
  localStream?.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  // Send ICE
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("iceCandidate", {
        to: targetId,
        candidate: event.candidate,
      });
    }
  };

  // Play remote audio
  pc.ontrack = (event) => {
    const audio = new Audio();
    audio.srcObject = event.streams[0];
    audio.autoplay = true;

    audioElements[targetId] = audio;
  };

  peers[targetId] = pc;
  return pc;
};

export const getPeer = (id) => peers[id];

/* ---------------- CLEANUP ---------------- */

export const closeAllPeers = () => {
  Object.keys(peers).forEach((id) => {
    // Stop outgoing tracks
    peers[id].getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.stop();
      }
    });

    // Close connection
    peers[id].close();
    delete peers[id];
  });

  // Stop & remove audio elements
  Object.keys(audioElements).forEach((id) => {
    audioElements[id].pause();
    audioElements[id].srcObject = null;
    delete audioElements[id];
  });
};

export const stopLocalStream = () => {
  localStream?.getTracks().forEach((track) => track.stop());
  localStream = null;
};