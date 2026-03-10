import React, { useEffect, useState, useContext } from "react";
import { WifiOff } from "lucide-react";
import { SocketContext } from "../../context/SocketContext.jsx";
import { VoiceContext } from "../../context/VoiceContext.jsx";
import useGetGroupInfo from "../../hooks/group/useGetGroupInfo.js";
import { VOICE_EFFECTS } from "../../voice/voiceService.js";

const BAD_STATES = ["failed", "disconnected"];

const VOICE_COLORS = ["#00FF7B", "#FF00EE", "#00F2FF", "#EAFF00"];

// For non-anonymous groups prepend the "real voice" option
const REAL_VOICE = { id: "none", label: "🎤 My Voice" };

const VoiceChat = (props) => {
  const { socket } = useContext(SocketContext);
  const {
    joined,
    currentVoiceGroupId,
    speakingSocketIds,
    joinVoice,
    leaveVoice,
    currentEffect,
    changeEffect,
    isVoiceAnonymous,
    peerConnectionStates,
  } = useContext(VoiceContext);
  const { getGroupInfo } = useGetGroupInfo();

  const [usersInVoice, setUsersInVoice] = useState([]);
  const [isGroupAnonymous, setIsGroupAnonymous] = useState(true);
  const [showEffectPanel, setShowEffectPanel] = useState(false);

  const isInThisGroup = joined && currentVoiceGroupId === props.groupId;

  const gettingGroupInfo = async () => {
    if (!props.groupId) return;
    const data = await getGroupInfo({ groupId: props.groupId });
    setUsersInVoice(data?.voiceMembers || []);
    setIsGroupAnonymous(data?.isAnonymous);
  };

  useEffect(() => {
    gettingGroupInfo();
  }, [props.groupId]);

  useEffect(() => {
    if (!socket || !props.groupId) return;
    if (isInThisGroup) return;
    socket.emit("joinVoiceGroup", props.groupId);
  }, [socket, props.groupId, isInThisGroup]);

  useEffect(() => {
    if (!socket || !props.groupId) return;
    const eventName = `newVoiceMember-${props.groupId}`;
    const handleNewMember = (data) => setUsersInVoice((prev) => [...prev, data]);
    socket.on(eventName, handleNewMember);
    return () => socket.off(eventName, handleNewMember);
  }, [socket, props.groupId]);

  useEffect(() => {
    if (!socket || !props.groupId) return;
    const eventName = `voiceMemberRemoved-${props.groupId}`;
    const handleRemove = (data) =>
      setUsersInVoice((prev) => prev.filter((e) => e.user._id !== data.user._id));
    socket.on(eventName, handleRemove);
    return () => socket.off(eventName, handleRemove);
  }, [socket, props.groupId]);

  // Effects list: anonymous → 5 effects only, non-anonymous → real voice + 5 effects
  const effectOptions = isGroupAnonymous ? VOICE_EFFECTS : [REAL_VOICE, ...VOICE_EFFECTS];

  return (
    <div className="fixed md:top-28 top-20 left-0 w-full md:w-1/2 md:left-1/4 mx-auto z-20">

      {/* Voice changer panel — floats above the bar when open */}
      {isInThisGroup && showEffectPanel && (
        <div className="mb-2 bg-black border border-white/20 rounded-2xl px-3 py-2 flex flex-wrap gap-2 justify-center">
          {effectOptions.map((effect) => {
            const isActive = currentEffect === effect.id;
            return (
              <button
                key={effect.id}
                onClick={() => { changeEffect(effect.id); setShowEffectPanel(false); }}
                className="text-xs md:text-sm font-bold px-3 py-1 rounded-full border transition"
                style={{
                  borderColor: isActive ? "#FF00EE" : "rgba(255,255,255,0.2)",
                  background: isActive ? "rgba(255,0,238,0.15)" : "transparent",
                  color: isActive ? "#FF00EE" : "white",
                }}
              >
                {effect.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Main voice bar */}
      <div className="overflow-y-auto bg-black text-white px-4 py-2 flex justify-between items-center rounded-full border-2 border-white">
        {!usersInVoice.length ? (
          <p className="font-bold text-sm">No one is in voice chat</p>
        ) : (
          <div className="flex flex-row items-center justify-center w-3/4 gap-4">
            {usersInVoice.map((e, index) => {
              const color = VOICE_COLORS[index % 4];
              const isSpeaking = speakingSocketIds.has(e.socketId);
              const hasConnectionIssue = BAD_STATES.includes(peerConnectionStates[e.socketId]);
              return (
                <div key={e.user._id} className="flex flex-col justify-center items-center font-bold text-sm">
                  <div className="relative">
                    <img
                      src={`/profiles/${e.user.profilePic}.png`}
                      alt={e.user.username}
                      className="w-10 h-10 rounded-full object-cover"
                      style={{
                        border: `3px solid ${hasConnectionIssue ? "#ef4444" : color}`,
                        boxShadow: hasConnectionIssue
                          ? "0 0 8px #ef4444, 0 0 16px #ef444488"
                          : isSpeaking ? `0 0 8px ${color}, 0 0 16px ${color}` : "none",
                        transition: "box-shadow 0.1s ease",
                        opacity: hasConnectionIssue ? 0.6 : isSpeaking ? 1 : 0.75,
                      }}
                    />
                    {hasConnectionIssue && (
                      <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5">
                        <WifiOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <span style={{ color: hasConnectionIssue ? "#ef4444" : isSpeaking ? color : "white", transition: "color 0.1s ease" }}>
                    {isGroupAnonymous ? e.user.humanNum : e.user.username}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Voice changer button — only shown when in this group */}
          {isInThisGroup && (
            <button
              onClick={() => setShowEffectPanel((v) => !v)}
              title="Voice Changer"
              className="text-lg px-2 py-1 rounded-full border transition"
              style={{
                borderColor: showEffectPanel ? "#FF00EE" : "rgba(255,255,255,0.3)",
                background: showEffectPanel ? "rgba(255,0,238,0.15)" : "transparent",
              }}
            >
              🎭
            </button>
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
              onClick={() => joinVoice(props.groupId, isGroupAnonymous)}
              className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-sm"
            >
              Join Voice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
