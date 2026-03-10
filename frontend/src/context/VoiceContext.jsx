import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext.jsx";
import { useAuthContext } from "./AuthContext.jsx";
import {
  initVoice,
  createPeer,
  getPeer,
  closeAllPeers,
  stopLocalStream,
  getLocalAnalyser,
  getRemoteAnalysers,
  getAudioLevel,
  getSpeakingThreshold,
  applyEffect,
  getCurrentDefaultEffect,
} from "../voice/voiceService.js";
import useAddMember from "../hooks/voice/useAddMember.js";
import useRemoveMember from "../hooks/voice/useRemoveMember.js";
import toast from "react-hot-toast";

export const VoiceContext = createContext();

export const VoiceContextProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const { authUser } = useAuthContext();
  const [joined, setJoined] = useState(false);
  const [currentVoiceGroupId, setCurrentVoiceGroupId] = useState(null);
  const [currentVoiceGroupName, setCurrentVoiceGroupName] = useState(null);
  const [usersInVoice, setUsersInVoice] = useState([]);
  const [speakingSocketIds, setSpeakingSocketIds] = useState(new Set());
  const [currentEffect, setCurrentEffect] = useState("none");
  const [isVoiceAnonymous, setIsVoiceAnonymous] = useState(false);

  const { addVoiceMember } = useAddMember();
  const { removeVoiceMember } = useRemoveMember();

  const joinVoice = async (groupId, isAnonymous = false) => {
    if (!authUser) return toast.error("You must be logged in to join voice chat.");
    if (!socket) return;

    try {
      const res = await fetch("/api/group/getGroupById", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ groupId }),
      });
      const groupData = await res.json();
      setCurrentVoiceGroupName(groupData?.name || "");
      setUsersInVoice(groupData?.voiceMembers || []);
    } catch (e) {
      console.log(e);
    }

    await initVoice(socket, groupId, authUser, isAnonymous);
    addVoiceMember({ socketId: socket.id, groupId });
    setCurrentVoiceGroupId(groupId);
    setIsVoiceAnonymous(isAnonymous);
    setCurrentEffect(getCurrentDefaultEffect(isAnonymous));
    setJoined(true);
  };

  const changeEffect = (effectId) => {
    applyEffect(effectId);
    setCurrentEffect(effectId);
  };

  const leaveVoice = () => {
    if (!joined || !socket) return;
    closeAllPeers();
    stopLocalStream();
    socket.emit("leaveVoiceGroup", currentVoiceGroupId);
    removeVoiceMember({ socketId: socket.id, groupId: currentVoiceGroupId });
    setJoined(false);
    setCurrentVoiceGroupId(null);
    setCurrentVoiceGroupName(null);
    setUsersInVoice([]);
    setCurrentEffect("none");
    setIsVoiceAnonymous(false);
  };

  // Leave voice on page close/refresh only
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (joined && socket && currentVoiceGroupId) {
        socket.emit("leaveVoiceGroup", currentVoiceGroupId);
        closeAllPeers();
        stopLocalStream();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [joined, currentVoiceGroupId, socket]);

  // WebRTC signaling — persists across navigation
  useEffect(() => {
    if (!socket || !joined) return;

    const handleNewUserJoined = async (id) => {
      const pc = createPeer(socket, id);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { to: id, offer });
    };
    const handleOffer = async ({ offer, from }) => {
      const pc = createPeer(socket, from);
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { to: from, answer });
    };
    const handleAnswer = async ({ answer, from }) => {
      await getPeer(from)?.setRemoteDescription(answer);
    };
    const handleIceCandidate = ({ candidate, from }) => {
      getPeer(from)?.addIceCandidate(candidate);
    };

    socket.on("newUserJoined", handleNewUserJoined);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("iceCandidate", handleIceCandidate);

    return () => {
      socket.off("newUserJoined", handleNewUserJoined);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("iceCandidate", handleIceCandidate);
    };
  }, [socket, joined]);

  // Keep usersInVoice in sync for MiniVoiceBar — persists across navigation
  useEffect(() => {
    if (!socket || !currentVoiceGroupId) return;

    const addEvent = `newVoiceMember-${currentVoiceGroupId}`;
    const removeEvent = `voiceMemberRemoved-${currentVoiceGroupId}`;

    const handleAdd = (data) => setUsersInVoice((prev) => [...prev, data]);
    const handleRemove = (data) =>
      setUsersInVoice((prev) => prev.filter((e) => e.user._id !== data.user._id));

    socket.on(addEvent, handleAdd);
    socket.on(removeEvent, handleRemove);

    return () => {
      socket.off(addEvent, handleAdd);
      socket.off(removeEvent, handleRemove);
    };
  }, [socket, currentVoiceGroupId]);

  // Poll audio levels every 100ms to detect who is speaking
  useEffect(() => {
    if (!joined || !socket) return;

    const threshold = getSpeakingThreshold();

    const interval = setInterval(() => {
      const speaking = new Set();

      // Local user
      if (getAudioLevel(getLocalAnalyser()) > threshold) {
        speaking.add(socket.id);
      }

      // Remote users
      Object.entries(getRemoteAnalysers()).forEach(([socketId, analyser]) => {
        if (getAudioLevel(analyser) > threshold) {
          speaking.add(socketId);
        }
      });

      // Only update state when the set actually changes (avoids constant re-renders)
      setSpeakingSocketIds((prev) => {
        if (
          prev.size === speaking.size &&
          [...prev].every((id) => speaking.has(id))
        ) {
          return prev;
        }
        return speaking;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [joined, socket]);

  return (
    <VoiceContext.Provider
      value={{ joined, currentVoiceGroupId, currentVoiceGroupName, usersInVoice, speakingSocketIds, joinVoice, leaveVoice, currentEffect, changeEffect, isVoiceAnonymous }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoiceContext = () => useContext(VoiceContext);
