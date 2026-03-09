import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../context/SocketContext.jsx";
import { VoiceContext } from "../../context/VoiceContext.jsx";
import useGetGroupInfo from "../../hooks/group/useGetGroupInfo.js";

const VOICE_COLORS = ["#00FF7B", "#FF00EE", "#00F2FF", "#EAFF00"];

const VoiceChat = (props) => {
  const { socket } = useContext(SocketContext);
  const { joined, currentVoiceGroupId, speakingSocketIds, joinVoice, leaveVoice } = useContext(VoiceContext);
  const { getGroupInfo } = useGetGroupInfo();

  const [usersInVoice, setUsersInVoice] = useState([]);
  const [isGroupAnonymous, setIsGroupAnonymous] = useState(true);

  // Is the user in voice for THIS specific group?
  const isInThisGroup = joined && currentVoiceGroupId === props.groupId;

  // Fetch initial voice members from DB
  const gettingGroupInfo = async () => {
    if (!props.groupId) return;
    const data = await getGroupInfo({ groupId: props.groupId });
    setUsersInVoice(data?.voiceMembers || []);
    setIsGroupAnonymous(data?.isAnonymous);
  };

  useEffect(() => {
    gettingGroupInfo();
  }, [props.groupId]);

  // Join socket room for receiving voice events (display only — no audio, no DB)
  // Skip if already in voice for this group — socket is already in the room,
  // and re-emitting would trigger newUserJoined on others causing duplicate WebRTC connections
  useEffect(() => {
    if (!socket || !props.groupId) return;
    if (isInThisGroup) return;
    socket.emit("joinVoiceGroup", props.groupId);
  }, [socket, props.groupId, isInThisGroup]);

  // Listen for new voice members in this group
  useEffect(() => {
    if (!socket || !props.groupId) return;
    const eventName = `newVoiceMember-${props.groupId}`;
    const handleNewMember = (data) => {
      setUsersInVoice((prev) => [...prev, data]);
    };
    socket.on(eventName, handleNewMember);
    return () => socket.off(eventName, handleNewMember);
  }, [socket, props.groupId]);

  // Listen for removed voice members in this group
  useEffect(() => {
    if (!socket || !props.groupId) return;
    const eventName = `voiceMemberRemoved-${props.groupId}`;
    const handleRemove = (data) => {
      setUsersInVoice((prev) =>
        prev.filter((e) => e.user._id !== data.user._id)
      );
    };
    socket.on(eventName, handleRemove);
    return () => socket.off(eventName, handleRemove);
  }, [socket, props.groupId]);

  return (
    <div className="fixed overflow-y-auto md:top-28 top-20 left-0 w-full md:w-1/2 md:left-1/4 mx-auto bg-black text-white px-4 py-2 flex justify-between items-center z-20 rounded-full border-2 border-white">
      {!usersInVoice.length ? (
        <p className="font-bold text-sm">No one is in voice chat</p>
      ) : (
        <div className="flex flex-row items-center justify-center w-3/4 gap-4">
          {usersInVoice.map((e, index) => {
            const color = VOICE_COLORS[index % 4];
            const isSpeaking = speakingSocketIds.has(e.socketId);
            return (
              <div key={e.user._id} className="flex flex-col justify-center items-center font-bold text-sm">
                <img
                  src={`/profiles/${e.user.profilePic}.png`}
                  alt={e.user.username}
                  className="w-10 h-10 rounded-full object-cover"
                  style={{
                    border: `3px solid ${color}`,
                    boxShadow: isSpeaking ? `0 0 8px ${color}, 0 0 16px ${color}` : "none",
                    transition: "box-shadow 0.1s ease",
                    opacity: isSpeaking ? 1 : 0.75,
                  }}
                />
                <span style={{ color: isSpeaking ? color : "white", transition: "color 0.1s ease" }}>
                  {isGroupAnonymous ? e.user.humanNum : e.user.username}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {isInThisGroup ? (
        <button
          onClick={leaveVoice}
          className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-sm"
        >
          Leave
        </button>
      ) : joined ? (
        <button
          disabled
          className="bg-gray-600 px-4 py-1 rounded text-sm cursor-not-allowed opacity-60"
        >
          In Voice Elsewhere
        </button>
      ) : (
        <button
          onClick={() => joinVoice(props.groupId)}
          className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-sm"
        >
          Join Voice
        </button>
      )}
    </div>
  );
};

export default VoiceChat;
