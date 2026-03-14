import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CircleX } from "lucide-react";
dayjs.extend(relativeTime);

import Nav from "../../components/Nav.jsx";
import "../custom.css";
import useSendMessages from "../../hooks/message/useSendMessages.js";
import useGetMessages from "../../hooks/message/useGetMessages.js";
import useGetGroupInfo from "../../hooks/group/useGetGroupInfo.js";
import useSendPass from "../../hooks/group/useSendPass.js";
import useDeleteMessage from "../../hooks/message/useDeleteMessage.js";
import useGetLists from "../../hooks/user/useGetLists.js";

import Message from "../../components/chatComponents/Message.jsx";
import AlertMessage from "../../components/chatComponents/AlertMessage.jsx";
import UserActionPopup from "../../components/UserActionPopup.jsx";
import { useContext } from "react";
import { SocketContext } from "../../context/SocketContext.jsx";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { VoiceContext } from "../../context/VoiceContext.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import MessageSkeleton from "../../components/chatComponents/MessageSkeleton.jsx";
import VoiceChat from "../../components/chatComponents/VoiceChat.jsx";

const ChatZone = () => {
  const { socket } = useContext(SocketContext);
  const { joined, currentVoiceGroupName } = useContext(VoiceContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { groupName } = useParams();

  // MiniVoiceBar is visible on mobile when user is in voice in a different group
  const miniBarVisible = joined && location.pathname !== `/chatZone/${currentVoiceGroupName}`;

  const [groupInfo, setGroupInfo] = useState({
    id: "",
    creatorId: "",
    isAnonymous: "",
    isPublic: "",
    members: "",
  });
  const [chatLoading, setChatLoading] = useState(false);
  const [groupNotFound, setGroupNotFound] = useState(false);
  const [isAllowed, setIsAllowed] = useState("checking");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [myMessage, setMyMessage] = useState({ message: "", id: "", pic: "" });
  const [conversation, setConversation] = useState([]);
  const [tempInfo, setTempInfo] = useState({ id: "", pic: "" });
  const [groupPass, setGroupPass] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);

  const { loading, sendMessage } = useSendMessages();
  const { getMessages } = useGetMessages();
  const { authUser } = useAuthContext();
  const { getGroupInfo } = useGetGroupInfo();
  const { passLoading, sendPass } = useSendPass();
  const { deleteMessage } = useDeleteMessage();
  const { getLists } = useGetLists();

  const [muteIds, setMuteIds] = useState(new Set());
  const [blockIds, setBlockIds] = useState(new Set());
  const [chatPopupTarget, setChatPopupTarget] = useState(null); // senderId object

  const currGroup = JSON.parse(localStorage.getItem("zdm-group")) || "ALL";

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await sendMessage(myMessage, currGroup, replyTarget?._id);
    setMyMessage({ message: "" });
    setReplyTarget(null);
  };

  const lastMessageRef = useRef(null);
  const chatContainerRef = useRef(null);
  const topSentinelRef = useRef(null);
  const isPrepending = useRef(false);
  const prevScrollHeight = useRef(0);
  const isInitialLoad = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const gettingGroupInfo = async () => {
    const data = await getGroupInfo({ groupName });
    if (!data || !data._id) {
      setGroupNotFound(true);
      return;
    }
    setGroupInfo({
      id: data?._id,
      creatorId: data?.creatorId,
      isAnonymous: data?.isAnonymous,
      isPublic: data?.isPublic,
      members: data?.members,
    });
    if (data?.isPublic) {
      setIsAllowed("yes");
    } else {
      setIsAllowed("no");
    }
    if (data.members.includes(authUser?.id)) {
      setIsAllowed("yes");
    }
  };

  const handleScroll = () => {
    const el = chatContainerRef.current;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    if (isPrepending.current) {
      const container = chatContainerRef.current;
      if (container) container.scrollTop = container.scrollHeight - prevScrollHeight.current;
      isPrepending.current = false;
    } else if (isInitialLoad.current) {
      lastMessageRef.current?.scrollIntoView({ behavior: "instant" });
      isInitialLoad.current = false;
    } else if (isAtBottom) {
      setTimeout(() => lastMessageRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [conversation]);

  const loadMoreMessages = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const container = chatContainerRef.current;
    if (container) prevScrollHeight.current = container.scrollHeight;
    isPrepending.current = true;
    const data = await getMessages(currGroup, nextPage);
    setConversation((prev) => [...data.messages, ...prev]);
    setHasMore(data.hasMore);
    setPage(nextPage);
    setLoadingMore(false);
  };

  useEffect(() => {
    if (!topSentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) loadMoreMessages();
      },
      { threshold: 0.1 }
    );
    observer.observe(topSentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  useEffect(() => {
    setChatLoading(true);
    const gettingMessages = async () => {
      isInitialLoad.current = true;
      const data = await getMessages(currGroup, 1);
      setConversation(data.messages);
      setHasMore(data.hasMore);
      setPage(1);
      setChatLoading(false);
    };
    gettingMessages();
    gettingGroupInfo();
    if (authUser) {
      getLists().then((data) => {
        setMuteIds(new Set((data?.muteList || []).map((u) => u._id)));
        setBlockIds(new Set((data?.blockList || []).map((u) => u._id)));
      });
    }
  }, [navigate]);

  useEffect(() => {
    if (!socket) return;
    const handleUserSocketId = (data) => setTempInfo({ id: data.id, pic: data.pic });
    socket.on("userSocketId", handleUserSocketId);
    socket.emit("requestUserInfo");
    socket.on(`newMessage-${currGroup}`, (newMessage) => {
      setConversation((prev) => [...prev, newMessage]);
    });
    return () => {
      socket.off("userSocketId");
      socket.off(`newMessage-${currGroup}`);
    };
  }, [socket]);

  const handlePass = async (e) => {
    e.preventDefault();
    if (!authUser) {
      toast.error("LOGIN OR SIGNUP FOR THIS OPTION");
    } else {
      const res = await sendPass({ groupId: groupInfo.id, password: groupPass });
      setIsAllowed(res ? "yes" : "no");
    }
  };

  const handleReplyMsg = (messageId, messageText) => setReplyTarget({ _id: messageId, message: messageText });
  const handleCopyMsg = (messageText) => navigator.clipboard.writeText(messageText);

  const handleChatMuteToggle = (userId, newMuted) => {
    setMuteIds((prev) => {
      const next = new Set(prev);
      if (newMuted) next.add(userId);
      else next.delete(userId);
      return next;
    });
  };

  const handleChatBlock = (userId) => {
    setBlockIds((prev) => new Set([...prev, userId]));
    setChatPopupTarget(null);
  };

  const handleDeleteMsg = async (messageId) => {
    if (authUser) {
      if (window.confirm("ARE YOU SURE TO DELETE THE MESSAGE?")) {
        const res = await deleteMessage(messageId);
        if (res.ok) location.reload();
        else toast.error("YOU CAN ONLY DELETE YOUR OWN MESSAGES");
      }
    } else {
      toast.error("YOU NEED TO LOGIN OR SIGNUP FOR THIS OPTION!");
    }
  };

  return (
    <>
      <Nav />
      <AlertMessage message={currGroup} />

      {/* User action popup from clicking avatar in chat */}
      {chatPopupTarget && (
        <UserActionPopup
          user={chatPopupTarget}
          isAnonymous={groupInfo.isAnonymous}
          isMuted={muteIds.has(chatPopupTarget._id)}
          onClose={() => setChatPopupTarget(null)}
          onMuteToggle={handleChatMuteToggle}
          onBlock={handleChatBlock}
        />
      )}

      {/* Group not found */}
      {groupNotFound && (
        <div className={`fixed inset-0 flex items-center justify-center bg-black ${miniBarVisible ? "pt-32 md:pt-28" : "pt-20 md:pt-28"}`}>
          <div className="flex flex-col items-center justify-center text-center px-6 gap-6">
            <div style={{ fontSize: "72px", filter: "drop-shadow(0 0 32px #FF00EE)", marginBottom: "8px" }}>💀</div>
            <h2
              className="pixel-font"
              style={{
                background: "linear-gradient(90deg, #FF00EE, #00F2FF, #EAFF00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "clamp(1.4rem, 5vw, 2rem)",
                letterSpacing: "0.15em",
              }}
            >
              GROUP NOT FOUND
            </h2>
            <p className="font-mono" style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.95rem", maxWidth: "320px", lineHeight: 1.7 }}>
              This group no longer exists or was deleted by its creator.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              {["#FF00EE", "#00F2FF", "#EAFF00", "#00FF7B"].map((c, i) => (
                <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: c, boxShadow: `0 0 10px ${c}` }} />
              ))}
            </div>
            <button
              onClick={() => navigate("/explore")}
              className="font-mono font-bold rounded-full px-8 py-3 transition-all duration-200 cursor-pointer mt-2"
              style={{ border: "1px solid #00FF7B", color: "#00FF7B", background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#00FF7B"; e.currentTarget.style.color = "#000"; e.currentTarget.style.boxShadow = "0 0 18px #00FF7B88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00FF7B"; e.currentTarget.style.boxShadow = "none"; }}
            >
              EXPLORE GROUPS →
            </button>
          </div>
        </div>
      )}

      {/* Full-screen layout below navbar */}
      {!groupNotFound && <div className={`fixed inset-0 flex flex-col lg:flex-row overflow-hidden bg-black ${miniBarVisible ? "pt-32 md:pt-28" : "pt-20 md:pt-28"}`}>

        {/* Voice Chat — horizontal bar on mobile, vertical sidebar on desktop */}
        <VoiceChat groupId={groupInfo.id} />

        {/* Chat column */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Messages scrollable area */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto overflow-x-hidden p-3"
          >
            {isAllowed === "yes" ? (
              <>
                <div ref={topSentinelRef} />
                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {chatLoading ? (
                  Array(5).fill(0).map((_, i) => <MessageSkeleton key={i} />)
                ) : conversation.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "60vh" }}>
                    <div style={{ fontSize: "72px", filter: "drop-shadow(0 0 24px #00FF7B)", marginBottom: "24px" }}>💬</div>
                    <h2
                      className="pixel-font"
                      style={{
                        background: "linear-gradient(90deg, #00FF7B, #00F2FF, #FF00EE, #EAFF00)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontSize: "1.8rem",
                        letterSpacing: "0.15em",
                        marginBottom: "12px",
                      }}
                    >
                      NO MESSAGES YET
                    </h2>
                    <p className="font-mono text-lg" style={{ color: "#00F2FF", opacity: 0.6, marginBottom: "28px" }}>
                      Be the first to say something!
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {["#00FF7B", "#FF00EE", "#00F2FF", "#EAFF00"].map((c, i) => (
                        <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: c, boxShadow: `0 0 10px ${c}` }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  conversation.map((msg) => {
                    const senderUserId = msg.senderId?._id;
                    if (senderUserId && blockIds.has(senderUserId)) return null;

                    let displayName = "";
                    if (!groupInfo.isAnonymous) {
                      displayName = msg.senderId ? msg.senderId.username : "GUEST-" + msg.tempUser.slice(0, 10);
                    } else {
                      displayName = msg.senderId ? "HUMAN-" + msg.senderId.humanNum : "GUEST-" + msg.tempUser.slice(0, 10);
                    }
                    const isMuted = senderUserId ? muteIds.has(senderUserId) : false;
                    return (
                      <Message
                        key={msg._id}
                        img={`/profiles/${msg.senderId ? msg.senderId.profilePic : "defaultPic"}.png`}
                        username={displayName}
                        message={msg.message}
                        time={dayjs(msg.createdAt).fromNow()}
                        messageId={msg._id}
                        reply={msg.replyTo}
                        isMuted={isMuted}
                        senderId={msg.senderId && authUser && msg.senderId._id !== authUser._id ? msg.senderId : null}
                        onUserClick={(senderObj) => setChatPopupTarget(senderObj)}
                        handleReplyMsg={handleReplyMsg}
                        handleCopyMsg={handleCopyMsg}
                        handleDeleteMsg={handleDeleteMsg}
                      />
                    );
                  })
                )}
                <div ref={lastMessageRef} />
              </>
            ) : isAllowed === "no" ? (
              <div className="flex flex-col items-center justify-center h-full gap-8">
                <p className="text-center text-4xl">This Group is Private</p>
                <form onSubmit={handlePass} className="w-5/6 flex flex-col space-y-3 mx-auto max-w-md">
                  <label className="text-2xl showUpAnimate">Password</label>
                  <input
                    type="password"
                    maxLength={25}
                    value={groupPass}
                    onChange={(e) => setGroupPass(e.target.value)}
                    className="bg-transparent rounded-full py-3 px-8 text-2xl font-mono border-2 outline-none"
                  />
                  <br />
                  <button
                    type="submit"
                    className={`bg-transparent border-2 rounded-full p-5 text-2xl w-1/2 transition duration-300 ease-out m-auto ${!passLoading && "hover:bg-white hover:text-black active:bg-black active:text-white"} xl:w-1/4 cursor-pointer`}
                    disabled={passLoading}
                  >
                    {passLoading ? (
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin m-auto" />
                    ) : "ENTER"}
                  </button>
                </form>
              </div>
            ) : null}
          </div>

          {/* Message input — inline at bottom of chat column */}
          {isAllowed === "yes" && (
            <div className="flex-shrink-0 px-3 py-3 pb-16 md:pb-3 bg-black" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {replyTarget && (
                <div
                  className="flex justify-between items-center rounded-2xl px-4 py-2 mb-2 font-mono text-sm md:text-base"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <p className="break-words break-all truncate flex-1">
                    Replying to:{" "}
                    {replyTarget.message.length > 70 ? replyTarget.message.slice(0, 70) + "..." : replyTarget.message}
                  </p>
                  <button type="button" onClick={() => setReplyTarget(null)} className="ml-2 flex-shrink-0">
                    <CircleX className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <input
                  className="flex-1 bg-black rounded-full py-3 px-5 text-xl font-mono border-2 border-b-fuchsia-600 border-l-fuchsia-400 border-r-fuchsia-400 outline-none h-14 md:h-16"
                  type="text"
                  value={myMessage.message}
                  onChange={(e) => setMyMessage({ message: e.target.value, id: tempInfo.id, pic: tempInfo.pic })}
                />
                <button
                  className={`w-24 flex-shrink-0 bg-black border-2 border-b border-l-fuchsia-400 border-b-fuchsia-400 rounded-full text-xl h-14 md:h-16 transition duration-300 ease-out cursor-pointer ${!loading && "lg:hover:bg-white lg:hover:text-black active:bg-black active:text-white"}`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin m-auto" />
                  ) : "SEND"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>}
    </>
  );
};

export default ChatZone;
