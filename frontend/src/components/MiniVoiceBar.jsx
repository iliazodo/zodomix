import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { VoiceContext } from "../context/VoiceContext.jsx";
import "../pages/custom.css";

const VOICE_COLORS = ["#00FF7B", "#FF00EE", "#00F2FF", "#EAFF00"];

const MiniVoiceBar = () => {
  const { joined, currentVoiceGroupName, usersInVoice, speakingSocketIds } = useContext(VoiceContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on the group page where user is in voice — VoiceChat handles display there
  const isOnVoiceGroupPage = location.pathname === `/chatZone/${currentVoiceGroupName}`;

  if (!joined || isOnVoiceGroupPage) return null;

  const handleClick = () => {
    localStorage.setItem("zdm-group", JSON.stringify(currentVoiceGroupName));
    navigate(`/chatZone/${currentVoiceGroupName}`);
  };

  return (
    <div className="w-full flex justify-center bg-black border-t border-green-500/40 py-1">
      <div
        onClick={handleClick}
        className="cursor-pointer flex flex-row items-center gap-2 px-4 py-1 border border-green-500 rounded-full hover:border-green-400 hover:bg-green-500/10 transition duration-200"
      >
        {/* Pulsing live dot */}
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />

        {/* Label */}
        <span className="text-green-400 text-xs pixel-font">Voice</span>

        {/* User icons with speaking color borders */}
        <div className="flex flex-row -space-x-1">
          {usersInVoice.map((e, index) => {
            const color = VOICE_COLORS[index % 4];
            const isSpeaking = speakingSocketIds.has(e.socketId);
            return (
              <img
                key={e.socketId || e.user._id}
                src={`/profiles/${e.user.profilePic}.png`}
                alt=""
                className="w-6 h-6 rounded-full"
                style={{
                  border: `2px solid ${color}`,
                  boxShadow: isSpeaking ? `0 0 6px ${color}, 0 0 12px ${color}` : "none",
                  transition: "box-shadow 0.1s ease",
                  opacity: isSpeaking ? 1 : 0.7,
                }}
              />
            );
          })}
        </div>

        {/* Group name */}
        <span className="text-white text-xs font-semibold max-w-24 truncate">
          {currentVoiceGroupName}
        </span>

        <span className="text-green-400 text-xs">⇨</span>
      </div>
    </div>
  );
};

export default MiniVoiceBar;
