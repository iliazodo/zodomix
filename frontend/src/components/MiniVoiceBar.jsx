import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { VoiceContext } from "../context/VoiceContext.jsx";
import "../pages/custom.css";

const MiniVoiceBar = () => {
  const { joined, currentVoiceGroupName, usersInVoice } = useContext(VoiceContext);
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

        {/* User icons */}
        <div className="flex flex-row -space-x-1">
          {usersInVoice.map((e) => (
            <img
              key={e.socketId || e.user._id}
              src={`/profiles/${e.user.profilePic}.png`}
              alt=""
              className="w-5 h-5 rounded-full border border-green-500"
            />
          ))}
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
