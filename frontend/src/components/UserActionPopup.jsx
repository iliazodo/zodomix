import React, { useEffect, useRef, useState } from "react";
import useMuteUser from "../hooks/user/useMuteUser.js";
import useUnmuteUser from "../hooks/user/useUnmuteUser.js";
import useBanUser from "../hooks/user/useBanUser.js";
import toast from "react-hot-toast";

/**
 * A floating popup triggered when clicking a user avatar in chat or voice chat.
 *
 * Props:
 *   user         – { _id, username, profilePic, humanNum }
 *   isAnonymous  – bool, whether the group is anonymous
 *   isMuted      – bool, whether this user is in the local mute list
 *   onClose      – fn()
 *   onMuteToggle – fn(userId, newMutedState) — updates parent list state
 *   onBlock      – fn(userId) — called after successful block
 *   // voice-only props (optional):
 *   socketId     – string, the peer's socket id
 *   volume       – number 0-1 (current peer volume)
 *   onVolumeChange – fn(socketId, volume)
 *   isVoiceMuted   – bool (local audio mute, not the persistent mute)
 *   onVoiceMuteToggle – fn(socketId)
 */
const UserActionPopup = ({
  user,
  isAnonymous,
  isMuted,
  onClose,
  onMuteToggle,
  onBlock,
  socketId,
  volume,
  onVolumeChange,
  isVoiceMuted,
  onVoiceMuteToggle,
}) => {
  const overlayRef = useRef(null);
  const { muteLoading, muteUser } = useMuteUser();
  const { unmuteLoading, unmuteUser } = useUnmuteUser();
  const { banLoading, banUser } = useBanUser();
  const [localVolume, setLocalVolume] = useState(volume ?? 1);

  // Click-outside closes the popup
  useEffect(() => {
    const handler = (e) => {
      if (overlayRef.current && e.target === overlayRef.current) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Escape key closes
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const displayName = isAnonymous
    ? `HUMAN-${user.humanNum}`
    : user.username;

  const handleMuteToggle = async () => {
    let ok;
    if (isMuted) {
      ok = await unmuteUser(user._id);
      if (ok) { toast.success("UNMUTED"); onMuteToggle(user._id, false); }
    } else {
      ok = await muteUser(user._id);
      if (ok) { toast.success("MUTED"); onMuteToggle(user._id, true); }
    }
  };

  const handleBlock = async () => {
    if (!window.confirm(`BLOCK ${displayName}? You can unblock them from your profile.`)) return;
    const ok = await banUser(user._id);
    if (ok) {
      toast.success("BLOCKED");
      onBlock(user._id);
      onClose();
    }
  };

  const handleVolumeChange = (val) => {
    setLocalVolume(val);
    onVolumeChange?.(socketId, val);
  };

  const isVoicePopup = socketId !== undefined;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="relative flex flex-col w-full max-w-xs rounded-2xl overflow-hidden"
        style={{
          background: "#000",
          border: "1px solid rgba(0,242,255,0.3)",
          boxShadow: "0 0 40px rgba(0,242,255,0.12), 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        {/* Top gradient bar */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, #00FF7B, #00F2FF, #FF00EE, #EAFF00)" }} />

        {/* Header */}
        <div className="flex items-center gap-4 px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ padding: "2px", borderRadius: "50%", background: "linear-gradient(135deg, #00FF7B, #FF00EE)", flexShrink: 0 }}>
            <img
              src={`/profiles/${user.profilePic}.png`}
              alt={displayName}
              className="rounded-full block"
              style={{ width: "52px", height: "52px", background: "#000" }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="pixel-font font-bold truncate" style={{ fontSize: "1rem", color: "#fff" }}>
              {displayName}
            </span>
            {!isAnonymous && (
              <span className="font-mono text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
                #{user.humanNum}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-auto font-mono text-xs flex-shrink-0"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4">
          {/* Voice-only: volume slider */}
          {isVoicePopup && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
                  {isVoiceMuted ? "🔇 MUTED" : "🔊 VOLUME"}
                </span>
                <span className="font-mono text-xs font-bold" style={{ color: "#00F2FF" }}>
                  {isVoiceMuted ? "0%" : `${Math.round(localVolume * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isVoiceMuted ? 0 : localVolume}
                disabled={isVoiceMuted}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: "#00F2FF", opacity: isVoiceMuted ? 0.3 : 1 }}
              />
              <button
                onClick={() => onVoiceMuteToggle?.(socketId)}
                className="w-full py-2 rounded-full font-mono font-bold text-xs transition-all duration-150"
                style={
                  isVoiceMuted
                    ? { background: "rgba(0,242,255,0.14)", border: "1px solid #00F2FF", color: "#00F2FF" }
                    : { background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }
                }
              >
                {isVoiceMuted ? "UNMUTE VOICE" : "MUTE VOICE"}
              </button>
            </div>
          )}

          {/* Divider for voice popups */}
          {isVoicePopup && (
            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
          )}

          {/* Persistent mute (messages) */}
          <button
            onClick={handleMuteToggle}
            disabled={muteLoading || unmuteLoading}
            className="w-full py-2.5 rounded-full font-mono font-bold text-sm transition-all duration-150"
            style={
              isMuted
                ? { background: "rgba(0,255,123,0.12)", border: "1px solid #00FF7B", color: "#00FF7B", boxShadow: "0 0 8px #00FF7B44" }
                : { background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }
            }
          >
            {muteLoading || unmuteLoading ? "..." : isMuted ? "📢 UNMUTE MESSAGES" : "🔕 MUTE MESSAGES"}
          </button>

          {/* Block */}
          <button
            onClick={handleBlock}
            disabled={banLoading}
            className="w-full py-2.5 rounded-full font-mono font-bold text-sm transition-all duration-150"
            style={{ background: "transparent", border: "1px solid #FF00EE", color: "#FF00EE" }}
          >
            {banLoading ? "..." : "🚫 BLOCK USER"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserActionPopup;
