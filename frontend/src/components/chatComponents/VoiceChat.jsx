import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../context/SocketContext.jsx";
import {
  initVoice,
  createPeer,
  getPeer,
  closeAllPeers,
  stopLocalStream,
} from "../../voice/voiceService.js";
import { useAuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import useAddVoiceMemeber from "../../hooks/voice/useAddMember.js";
import useRemoveVoiceMemeber from "../../hooks/voice/useRemoveMember.js";
import useGetGroupInfo from "../../hooks/group/useGetGroupInfo.js";

const VoiceChat = (props) => {
  const { socket } = useContext(SocketContext);
  const [joined, setJoined] = useState(false);
  const { authUser } = useAuthContext();
  const { addVoiceMember } = useAddVoiceMemeber();
  const { removeVoiceMember } = useRemoveVoiceMemeber();
  const { getGroupInfo } = useGetGroupInfo();
  const [usersInVoice, setUsersInVoice] = useState([]);

  // Get Group Information
  const gettingGroupInfo = async () => {
    const data = await getGroupInfo({ groupId: props.groupId });
    setUsersInVoice(data?.voiceMembers || []);
  };

  useEffect(() => {
    gettingGroupInfo();
  }, [props.groupId]);


  // Joining voice chat (start audio stream)
  const handleJoin = async () => {
    if (!authUser)
      return toast.error("You must be logged in to join voice chat.");
    if (!socket) return;

    await initVoice(socket, props.groupId, authUser); // Only getUserMedia and send audio after join
    addVoiceMember({ socketId: socket.id, groupId: props.groupId });
    setJoined(true);
  };

  // WebRTC signaling listeners: only active if joined
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
      socket.off("userLeft");
    };
  }, [socket, joined]);

  // handle leaving voice chat: close peers, stop stream, notify server
  const handleLeave = () => {
    closeAllPeers();
    stopLocalStream();
    socket.emit("leaveVoiceGroup", props.groupId);
    removeVoiceMember({ socketId: socket.id, groupId: props.groupId });
    setJoined(false);
  };

  // Join voice group on mount for presence/list, not audio
  useEffect(() => {
    if (!socket || !props.groupId) return;
    socket.emit("joinVoiceGroup", props.groupId);
    return () => {
      socket.emit("leaveVoiceGroup", props.groupId);
    };
  }, [socket, props.groupId]);

  // Listen for new users
  useEffect(() => {
    if (!socket || !props.groupId) return;

    const eventName = `newVoiceMember-${props.groupId}`;

    const handleNewMember = (data) => {
      setUsersInVoice((prev) => [...prev, data]);
    };

    socket.on(eventName, handleNewMember);

    return () => {
      socket.off(eventName, handleNewMember);
    };
  }, [socket, props.groupId]);

  // Listen for removed users
  useEffect(() => {
    if (!socket || !props.groupId) return;

    const eventName = `voiceMemberRemoved-${props.groupId}`;

    const handleRemove = (data) => {
      setUsersInVoice((prev) =>
        prev.filter((e) => e.user._id !== data.user._id),
      );
    };

    socket.on(eventName, handleRemove);

    return () => {
      socket.off(eventName, handleRemove);
    };
  }, [socket, props.groupId]);

  return (
    <div className="fixed top-[78px] left-0 w-full bg-black text-white px-4 py-2 flex justify-between items-center z-50 border-b border-gray-700">
      {!usersInVoice.length ? (
        <p className="font-bold text-sm">No one is in voice chat</p>
      ) : (
        <div className="flex flex-row items-center justify-center w-3/4">
          {usersInVoice.map((e) => (
            <p key={e.user._id} className="font-bold text-sm mr-4">
              <img
                src={`/profiles/${e.user.profilePic}.png`}
                alt={e.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            </p>
          ))}
        </div>
      )}

      {!joined ? (
        <button
          onClick={handleJoin}
          className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-sm"
        >
          Join Voice
        </button>
      ) : (
        <button
          onClick={handleLeave}
          className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-sm"
        >
          Leave
        </button>
      )}
    </div>
  );
};

export default VoiceChat;
