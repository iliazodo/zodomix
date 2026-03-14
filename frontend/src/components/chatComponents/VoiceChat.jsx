import React, { useEffect, useState, useContext } from "react";
import { WifiOff } from "lucide-react";
import { SocketContext } from "../../context/SocketContext.jsx";
import { VoiceContext } from "../../context/VoiceContext.jsx";
import useGetGroupInfo from "../../hooks/group/useGetGroupInfo.js";
import { VOICE_EFFECTS } from "../../voice/voiceService.js";

const BAD_STATES = ["failed", "disconnected"];
const VOICE_COLORS = ["#00FF7B", "#FF00EE", "#00F2FF", "#EAFF00"];
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
    peerConnectionStates,
  } = useContext(VoiceContext);
  const { getGroupInfo } = useGetGroupInfo();

  const [usersInVoice, setUsersInVoice] = useState([]);
  const [isGroupAnonymous, setIsGroupAnonymous] = useState(true);
  const [showEffectPanel, setShowEffectPanel] = useState(false);

  const isInThisGroup = joined && currentVoiceGroupId === props.groupId;
  const effectOptions = isGroupAnonymous ? VOICE_EFFECTS : [REAL_VOICE, ...VOICE_EFFECTS];

  const gettingGroupInfo = async () => {
    if (!props.groupId) return;
    const data = await getGroupInfo({ groupId: props.groupId });
    setUsersInVoice(data?.voiceMembers || []);
    setIsGroupAnonymous(data?.isAnonymous);
  };

  useEffect(() => { gettingGroupInfo(); }, [props.groupId]);

  useEffect(() => {
    if (!socket || !props.groupId || isInThisGroup) return;
    socket.emit("joinVoiceGroup", props.groupId);
  }, [socket, props.groupId, isInThisGroup]);

  useEffect(() => {
    if (!socket || !props.groupId) return;
    const ev = `newVoiceMember-${props.groupId}`;
    const handler = (data) => setUsersInVoice((prev) => [...prev, data]);
    socket.on(ev, handler);
    return () => socket.off(ev, handler);
  }, [socket, props.groupId]);

  useEffect(() => {
    if (!socket || !props.groupId) return;
    const ev = `voiceMemberRemoved-${props.groupId}`;
    const handler = (data) => setUsersInVoice((prev) => prev.filter((e) => e.user._id !== data.user._id));
    socket.on(ev, handler);
    return () => socket.off(ev, handler);
  }, [socket, props.groupId]);

  return (
    <div
      className="relative bg-black flex-shrink-0 flex flex-row items-center justify-between px-3 py-2 w-full lg:flex-col lg:items-stretch lg:justify-start lg:w-72 lg:h-full lg:px-4 lg:py-4 lg:overflow-y-auto scrollbar-hide"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", borderRight: "none" }}
    >
      {/* Desktop-only: gradient top accent + header */}
      <div className="hidden lg:block">
        <div style={{ height: "2px", background: "linear-gradient(90deg, #00FF7B, #00F2FF, #FF00EE, #EAFF00)", marginBottom: "16px", borderRadius: "2px" }} />
        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="text-base">🎙</span>
          <span className="pixel-font text-sm" style={{ color: "#00F2FF", letterSpacing: "0.1em" }}>VOICE CHAT</span>
          <span className="font-mono text-xs ml-auto" style={{ color: "rgba(255,255,255,0.4)" }}>{usersInVoice.length}/6</span>
        </div>
      </div>

      {/* Mobile-only: voice count badge */}
      <span className="lg:hidden font-mono text-xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>{usersInVoice.length}/6</span>

      {/* Users list */}
      <div className="flex flex-row items-center gap-3 flex-1 overflow-x-auto scrollbar-hide lg:flex-col lg:overflow-x-visible lg:flex-none lg:gap-0 lg:items-stretch">
        {!usersInVoice.length ? (
          <p className="font-mono text-xs lg:text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            No one in voice
          </p>
        ) : (
          usersInVoice.map((e, index) => {
            const color = VOICE_COLORS[index % 4];
            const isSpeaking = speakingSocketIds.has(e.socketId);
            const hasIssue = BAD_STATES.includes(peerConnectionStates[e.socketId]);
            return (
              <div
                key={e.user._id}
                className="flex flex-col items-center gap-1 flex-shrink-0 lg:flex-row lg:gap-3 lg:w-full lg:py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={`/profiles/${e.user.profilePic}.png`}
                    alt={e.user.username}
                    className="rounded-full object-cover w-9 h-9 lg:w-12 lg:h-12"
                    style={{
                      border: `3px solid ${hasIssue ? "#ef4444" : color}`,
                      boxShadow: hasIssue
                        ? "0 0 8px #ef4444"
                        : isSpeaking ? `0 0 8px ${color}, 0 0 18px ${color}88` : "none",
                      transition: "box-shadow 0.1s ease",
                      opacity: hasIssue ? 0.55 : isSpeaking ? 1 : 0.8,
                    }}
                  />
                  {hasIssue && (
                    <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5">
                      <WifiOff className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span
                  className="font-mono font-bold text-xs lg:text-sm truncate max-w-full"
                  style={{
                    color: hasIssue ? "#ef4444" : isSpeaking ? color : "rgba(255,255,255,0.75)",
                    transition: "color 0.1s ease",
                    textShadow: isSpeaking && !hasIssue ? `0 0 8px ${color}88` : "none",
                  }}
                >
                  {isGroupAnonymous ? `HUMAN-${e.user.humanNum}` : e.user.username}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Effect panel — dropdown on mobile, inline on desktop */}
      {isInThisGroup && showEffectPanel && (
        <div
          className="absolute top-full left-0 w-full z-50 flex flex-wrap gap-2 p-3 lg:relative lg:top-auto lg:flex-col lg:w-full lg:p-0 lg:mt-4 lg:pt-4 lg:gap-2"
          style={{
            background: "#000",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            borderTop: "none",
          }}
        >
          <div className="hidden lg:block w-full mb-1">
            <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>VOICE EFFECT</span>
          </div>
          {effectOptions.map((effect) => {
            const isActive = currentEffect === effect.id;
            return (
              <button
                key={effect.id}
                onClick={() => { changeEffect(effect.id); setShowEffectPanel(false); }}
                className="font-mono font-bold px-3 py-1.5 rounded-full border transition-all duration-150 text-xs lg:text-sm lg:text-left"
                style={{
                  borderColor: isActive ? "#FF00EE" : "rgba(255,255,255,0.18)",
                  background: isActive ? "rgba(255,0,238,0.14)" : "transparent",
                  color: isActive ? "#FF00EE" : "rgba(255,255,255,0.75)",
                  boxShadow: isActive ? "0 0 8px #FF00EE55" : "none",
                }}
              >
                {effect.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-row items-center gap-2 flex-shrink-0 lg:flex-col lg:mt-auto lg:pt-4 lg:gap-2 lg:w-full"
        style={{ borderTop: "none" }}
      >
        {/* Spacer on desktop between users and buttons */}
        <div className="hidden lg:block lg:flex-1" />

        {isInThisGroup && (
          <button
            onClick={() => setShowEffectPanel((v) => !v)}
            className="font-mono text-sm px-3 py-1.5 rounded-full border transition-all duration-150 flex-shrink-0 lg:w-full lg:text-center"
            style={{
              borderColor: showEffectPanel ? "#FF00EE" : "rgba(255,255,255,0.2)",
              background: showEffectPanel ? "rgba(255,0,238,0.12)" : "transparent",
              color: showEffectPanel ? "#FF00EE" : "rgba(255,255,255,0.6)",
            }}
          >
            🎭 <span className="hidden lg:inline">Voice Effect</span>
          </button>
        )}

        {isInThisGroup ? (
          <button
            onClick={leaveVoice}
            className="font-mono font-bold text-sm px-4 py-1.5 rounded-full cursor-pointer transition-all duration-150 flex-shrink-0 lg:w-full"
            style={{ background: "#ef4444", color: "#fff", border: "1px solid #ef4444" }}
          >
            Leave
          </button>
        ) : joined ? (
          <button
            disabled
            className="font-mono text-xs px-3 py-1.5 rounded-full cursor-not-allowed flex-shrink-0 lg:w-full lg:text-sm"
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.35)" }}
          >
            In Voice Elsewhere
          </button>
        ) : (
          <button
            onClick={() => joinVoice(props.groupId, isGroupAnonymous)}
            className="font-mono font-bold text-sm px-4 py-1.5 rounded-full cursor-pointer transition-all duration-150 flex-shrink-0 lg:w-full"
            style={{ background: "#00FF7B", color: "#000", border: "1px solid #00FF7B", boxShadow: "0 0 10px #00FF7B44" }}
          >
            Join Voice
          </button>
        )}
      </div>

      {/* Desktop right border */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
};

export default VoiceChat;
