import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext.jsx";
import { useAuthContext } from "./AuthContext.jsx";
import {
  initVoice,
  createPeer,
  getPeer,
  closeAllPeers,
  stopLocalStream,
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

  const { addVoiceMember } = useAddMember();
  const { removeVoiceMember } = useRemoveMember();

  const joinVoice = async (groupId) => {
    if (!authUser) return toast.error("You must be logged in to join voice chat.");
    if (!socket) return;
    await initVoice(socket, groupId, authUser);
    addVoiceMember({ socketId: socket.id, groupId });
    setCurrentVoiceGroupId(groupId);
    setJoined(true);
  };

  const leaveVoice = () => {
    if (!joined || !socket) return;
    closeAllPeers();
    stopLocalStream();
    socket.emit("leaveVoiceGroup", currentVoiceGroupId);
    removeVoiceMember({ socketId: socket.id, groupId: currentVoiceGroupId });
    setJoined(false);
    setCurrentVoiceGroupId(null);
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

  return (
    <VoiceContext.Provider value={{ joined, currentVoiceGroupId, joinVoice, leaveVoice }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoiceContext = () => useContext(VoiceContext);
