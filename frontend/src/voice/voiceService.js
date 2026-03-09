let localStream = null;
const peers = {};
const audioElements = {};

// Audio analysis
let audioContext = null;
const analysers = {}; // socketId → AnalyserNode
let localAnalyser = null;

const SPEAKING_THRESHOLD = 8;

const getAudioCtx = () => {
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioContext();
  }
  return audioContext;
};

/* ---------------- INIT ---------------- */

export const initVoice = async (socket, groupId, userInfo) => {
  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Analyser for local speaking detection
  try {
    const ctx = getAudioCtx();
    const source = ctx.createMediaStreamSource(localStream);
    localAnalyser = ctx.createAnalyser();
    localAnalyser.fftSize = 512;
    source.connect(localAnalyser);
  } catch (e) {
    console.log("Local analyser setup failed:", e);
  }

  socket.emit("joinVoiceGroup", groupId, userInfo);
  return localStream;
};

export const getLocalStream = () => localStream;

/* ---------------- CREATE PEER ---------------- */

export const createPeer = (socket, targetId) => {
  // Clean up existing connection before overwriting to prevent audio leaks
  if (audioElements[targetId]) {
    audioElements[targetId].pause();
    audioElements[targetId].srcObject = null;
    delete audioElements[targetId];
  }
  if (peers[targetId]) {
    peers[targetId].close();
    delete peers[targetId];
  }
  delete analysers[targetId];

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

  // Play remote audio + set up analyser for speaking detection
  pc.ontrack = (event) => {
    const audio = new Audio();
    audio.srcObject = event.streams[0];
    audio.autoplay = true;
    audioElements[targetId] = audio;

    try {
      const ctx = getAudioCtx();
      const source = ctx.createMediaStreamSource(event.streams[0]);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analysers[targetId] = analyser;
    } catch (e) {
      console.log("Remote analyser setup failed:", e);
    }
  };

  peers[targetId] = pc;
  return pc;
};

export const getPeer = (id) => peers[id];

/* ---------------- AUDIO LEVEL HELPERS ---------------- */

export const getAudioLevel = (analyser) => {
  if (!analyser) return 0;
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  return data.reduce((a, b) => a + b, 0) / data.length;
};

export const getLocalAnalyser = () => localAnalyser;
export const getRemoteAnalysers = () => analysers;
export const getSpeakingThreshold = () => SPEAKING_THRESHOLD;

/* ---------------- CLEANUP ---------------- */

export const closeAllPeers = () => {
  Object.keys(peers).forEach((id) => {
    peers[id].getSenders().forEach((sender) => {
      if (sender.track) sender.track.stop();
    });
    peers[id].close();
    delete peers[id];
  });

  Object.keys(audioElements).forEach((id) => {
    audioElements[id].pause();
    audioElements[id].srcObject = null;
    delete audioElements[id];
  });

  Object.keys(analysers).forEach((id) => {
    delete analysers[id];
  });

  localAnalyser = null;
};

export const stopLocalStream = () => {
  localStream?.getTracks().forEach((track) => track.stop());
  localStream = null;
  localAnalyser = null;

  if (audioContext && audioContext.state !== "closed") {
    audioContext.close();
    audioContext = null;
  }
};
