let rawMicStream = null;       // original mic, never modified
let localStream = null;        // processed stream sent to peers
const peers = {};
const audioElements = {};

// Audio graph
let audioContext = null;
let micSource = null;
let effectInputGain = null;    // feeds into effect chain
let effectDestination = null;  // MediaStreamDestination → peers
let activeOscillators = [];    // tracked so we can stop them on effect switch

// Analysis
const analysers = {};
let localAnalyser = null;

const SPEAKING_THRESHOLD = 8;

// ─── VOICE EFFECTS ──────────────────────────────────────────────────────────

export const VOICE_EFFECTS = [
  { id: "robot",    label: "🤖 Robot"    },
  { id: "demon",    label: "👹 Demon"    },
  { id: "alien",    label: "👽 Alien"    },
  { id: "radio",    label: "📻 Radio"    },
  { id: "ghost",    label: "👻 Ghost"    },
];

// ─── AUDIO CONTEXT ──────────────────────────────────────────────────────────

const getAudioCtx = () => {
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioContext();
  }
  return audioContext;
};

// ─── EFFECT BUILDER ─────────────────────────────────────────────────────────

const ringMod = (ctx, inputNode, frequency) => {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = frequency;

  const modGain = ctx.createGain();
  modGain.gain.value = 0;     // audio-rate modulated → ring mod
  osc.connect(modGain.gain);
  inputNode.connect(modGain);
  osc.start();
  activeOscillators.push(osc);
  return modGain;
};

const buildEffectChain = (effectId, ctx, inputNode) => {
  switch (effectId) {
    case "none": {
      inputNode.connect(effectDestination);
      return;
    }

    case "robot": {
      // Ring mod at 50 Hz → metallic robotic voice
      const mod = ringMod(ctx, inputNode, 50);
      mod.connect(effectDestination);
      return;
    }

    case "demon": {
      // Ring mod at 18 Hz + deep lowpass → dark rumbling demon
      const mod = ringMod(ctx, inputNode, 18);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 700;
      lp.Q.value = 1;
      mod.connect(lp);
      lp.connect(effectDestination);
      return;
    }

    case "alien": {
      // Ring mod at 230 Hz + highpass → eerie alien
      const mod = ringMod(ctx, inputNode, 230);
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 900;
      mod.connect(hp);
      hp.connect(effectDestination);
      return;
    }

    case "radio": {
      // Tight bandpass + waveshaper distortion → walkie-talkie/megaphone
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1800;
      bp.Q.value = 6;

      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 256 - 1;
        curve[i] = (Math.PI + 200) * x / (Math.PI + 200 * Math.abs(x));
      }
      const shaper = ctx.createWaveShaper();
      shaper.curve = curve;
      shaper.oversample = "4x";

      inputNode.connect(bp);
      bp.connect(shaper);
      shaper.connect(effectDestination);
      return;
    }

    case "ghost": {
      // Slow tremolo ring mod at 6 Hz → wavering ghostly voice
      const mod = ringMod(ctx, inputNode, 6);
      const eq = ctx.createBiquadFilter();
      eq.type = "peaking";
      eq.frequency.value = 2000;
      eq.gain.value = 8;
      mod.connect(eq);
      eq.connect(effectDestination);
      return;
    }

    default: {
      inputNode.connect(effectDestination);
    }
  }
};

// ─── APPLY / SWITCH EFFECT ──────────────────────────────────────────────────

export const applyEffect = (effectId) => {
  if (!effectInputGain || !effectDestination) return;
  const ctx = getAudioCtx();

  // Stop running oscillators from previous effect
  activeOscillators.forEach((osc) => { try { osc.stop(); } catch (e) {} });
  activeOscillators = [];

  // Disconnect all outgoing connections from effectInputGain
  try { effectInputGain.disconnect(); } catch (e) {}

  buildEffectChain(effectId, ctx, effectInputGain);
};

// ─── INIT ────────────────────────────────────────────────────────────────────

export const initVoice = async (socket, groupId, userInfo, isAnonymous) => {
  rawMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const ctx = getAudioCtx();

  // Source from raw mic
  micSource = ctx.createMediaStreamSource(rawMicStream);

  // Local analyser for speaking detection (uses raw mic, unaffected by effects)
  localAnalyser = ctx.createAnalyser();
  localAnalyser.fftSize = 512;
  micSource.connect(localAnalyser);

  // Effect pipeline: micSource → effectInputGain → [effects] → effectDestination
  effectInputGain = ctx.createGain();
  effectInputGain.gain.value = 1;
  micSource.connect(effectInputGain);

  effectDestination = ctx.createMediaStreamDestination();

  // Apply default effect
  const defaultEffect = isAnonymous ? "robot" : "none";
  buildEffectChain(defaultEffect, ctx, effectInputGain);

  // processedStream is what peers receive
  localStream = effectDestination.stream;

  socket.emit("joinVoiceGroup", groupId, userInfo);
  return localStream;
};

export const getLocalStream = () => localStream;
export const getCurrentDefaultEffect = (isAnonymous) => isAnonymous ? "robot" : "none";

/* ─── CREATE PEER ────────────────────────────────────────────────────────── */

export const createPeer = (socket, targetId) => {
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

  // Add processed stream tracks (not raw mic)
  localStream?.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("iceCandidate", { to: targetId, candidate: event.candidate });
    }
  };

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

/* ─── AUDIO LEVEL HELPERS ───────────────────────────────────────────────── */

export const getAudioLevel = (analyser) => {
  if (!analyser) return 0;
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  return data.reduce((a, b) => a + b, 0) / data.length;
};

export const getLocalAnalyser = () => localAnalyser;
export const getRemoteAnalysers = () => analysers;
export const getSpeakingThreshold = () => SPEAKING_THRESHOLD;

/* ─── CLEANUP ───────────────────────────────────────────────────────────── */

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

  Object.keys(analysers).forEach((id) => delete analysers[id]);

  localAnalyser = null;
};

export const stopLocalStream = () => {
  // Stop oscillators
  activeOscillators.forEach((osc) => { try { osc.stop(); } catch (e) {} });
  activeOscillators = [];

  // Stop raw mic tracks
  rawMicStream?.getTracks().forEach((track) => track.stop());
  rawMicStream = null;
  localStream = null;
  localAnalyser = null;
  micSource = null;
  effectInputGain = null;
  effectDestination = null;

  if (audioContext && audioContext.state !== "closed") {
    audioContext.close();
    audioContext = null;
  }
};
