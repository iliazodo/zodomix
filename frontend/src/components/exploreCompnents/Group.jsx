import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAddFavGroup from "../../hooks/group/useAddFavGroup.js";
import useGetFavGroups from "../../hooks/group/useGetFavGroups.js";
import { useAuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import "../../pages/custom.css"

const Group = (props) => {
  const [isFavGroup, setIsFavGroup] = useState(false);
  const [favLoading, setFavLoading] = useState(true);
  const [currentGroup, setCurrentGroup] = useState(JSON.parse(localStorage.getItem("zdm-group")));

  const navigate = useNavigate();

  const { addFavGroup } = useAddFavGroup();
  const { getFavGroups } = useGetFavGroups();
  const { authUser } = useAuthContext();

  const initialLiked = authUser ? (props.likes || []).some((id) => id?.toString() === authUser.id?.toString()) : false;
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState((props.likes || []).length);
  const [likeHovered, setLikeHovered] = useState(false);

  const handleJoin = () => {
    localStorage.setItem("zdm-group", JSON.stringify(props.name));
    navigate(`/chatZone/${props.name}`);

    let existing = JSON.parse(localStorage.getItem("zdm-chat-history")) || [];
    existing.push({ name: props.name, pic: props.picture });
    localStorage.setItem("zdm-chat-history", JSON.stringify(existing));
  };

  const handleFav = async () => {
    if (!authUser) {
      toast.error("LOGIN OR SIGNUP FOR THIS OPTION");
      return;
    }
    const newFav = !isFavGroup;
    setIsFavGroup(newFav);
    setIsLiked(newFav);
    setLikesCount(newFav ? likesCount + 1 : likesCount - 1);
    await addFavGroup(props._id);
  };

  useEffect(() => {
    const gettingFav = async () => {
      try {
        const data = await getFavGroups();
        data.map((group) => {
          if (group.groupName === props.name) {
            setIsFavGroup(true);
            setIsLiked(true);
          }
        });
      } catch (error) {
      } finally {
        setFavLoading(false);
      }
    };

    if (authUser) {
      gettingFav();
    } else {
      setFavLoading(false);
    }
  }, []);

  const handleLike = async () => {
    if (!authUser) {
      toast.error("LOGIN TO LIKE GROUPS");
      return;
    }
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setIsFavGroup(newLiked);
    setLikesCount(newLiked ? likesCount + 1 : likesCount - 1);
    await addFavGroup(props._id);
  };

  const [joinHovered, setJoinHovered] = useState(false);
  const [favHovered, setFavHovered] = useState(false);

  const isMain = props.groupType === "main";
  const isCurrentGroup = currentGroup === props.name;

  return (
    <div
      className="showUpAnimate relative flex flex-col bg-black rounded-2xl overflow-hidden m-auto w-[calc(100%-24px)] md:w-[calc(100%-32px)] lg:w-[calc(100%-40px)]"
      style={{
        border: "1px solid rgba(0, 242, 255, 0.3)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.6), 0 0 12px rgba(0,242,255,0.07)",
      }}
    >
      {/* Top gradient accent bar */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #00FF7B, #00F2FF, #FF00EE, #EAFF00)",
        }}
      />

      {/* Badge pill — top right */}
      <div className="absolute top-4 right-4">
        {isMain ? (
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              color: "#EAFF00",
              border: "1px solid #EAFF00",
              boxShadow: "0 0 8px #EAFF0066",
            }}
          >
            MAIN
          </span>
        ) : (
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              color: "#00FF7B",
              border: "1px solid #00FF7B",
              boxShadow: "0 0 8px #00FF7B66",
            }}
          >
            USER
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 md:p-5 flex flex-col gap-4 flex-grow">

        {/* Avatar + name + count */}
        <div className="flex items-center gap-4">
          {/* Gradient ring around avatar */}
          <div
            style={{
              padding: "2px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00FF7B, #FF00EE)",
              flexShrink: 0,
            }}
          >
            <img
              src={`/groups/${props.picture}.png`}
              alt={props.name}
              className="rounded-full block"
              style={{
                width: "64px",
                height: "64px",
                background: "#000",
              }}
            />
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <h3
              className="pixel-font font-bold truncate"
              style={{ fontSize: "1.05rem", lineHeight: "1.3" }}
            >
              {props.name}
            </h3>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs" style={{ color: "#00F2FF", opacity: 0.85 }}>
                {props.messageCount} messages
              </span>
              <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleLike(); }}
                onMouseEnter={() => setLikeHovered(true)}
                onMouseLeave={() => setLikeHovered(false)}
                className="font-mono text-xs flex items-center gap-1 cursor-pointer transition-all duration-200"
                style={{
                  color: isLiked ? "#FF00EE" : likeHovered ? "#FF00EE" : "rgba(255,255,255,0.4)",
                  textShadow: isLiked ? "0 0 8px #FF00EE88" : "none",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                {isLiked ? "♥︎" : "♡"} {likesCount}
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          className="font-mono text-xs md:text-sm leading-relaxed flex-grow"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {props.description}
        </p>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleJoin}
            onMouseEnter={() => setJoinHovered(true)}
            onMouseLeave={() => setJoinHovered(false)}
            className="flex-1 py-2 md:py-3 rounded-full font-mono font-bold text-sm md:text-base transition-all duration-200 cursor-pointer"
            style={
              isCurrentGroup
                ? {
                    background: "#00FF7B",
                    color: "#000",
                    boxShadow: "0 0 18px #00FF7B88",
                    border: "1px solid #00FF7B",
                  }
                : joinHovered
                ? {
                    background: "#00FF7B",
                    color: "#000",
                    border: "1px solid #00FF7B",
                    boxShadow: "0 0 18px #00FF7B88",
                  }
                : {
                    background: "transparent",
                    border: "1px solid #00FF7B",
                    color: "#00FF7B",
                  }
            }
          >
            {isCurrentGroup ? "✓ IN" : "JOIN"}
          </button>

          <button
            type="button"
            onClick={handleFav}
            onMouseEnter={() => setFavHovered(true)}
            onMouseLeave={() => setFavHovered(false)}
            className="rounded-full text-xl transition-all duration-200 cursor-pointer flex items-center justify-center"
            style={{
              width: "48px",
              flexShrink: 0,
              border: `1px solid ${isFavGroup || favHovered ? "#FF00EE" : "rgba(255,255,255,0.15)"}`,
              color: isFavGroup || favHovered ? "#FF00EE" : "rgba(255,255,255,0.25)",
              boxShadow: isFavGroup ? "0 0 14px #FF00EE66" : favHovered ? "0 0 10px #FF00EE44" : "none",
              background: favHovered && !isFavGroup ? "rgba(255,0,238,0.08)" : "transparent",
            }}
          >
            {favLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isFavGroup ? (
              "♥︎"
            ) : (
              "♡"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Group;
