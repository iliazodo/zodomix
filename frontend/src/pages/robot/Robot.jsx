import React, { useContext, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import Nav from "../../components/Nav.jsx";
import useSendToAi from "../../hooks/robot/useSendToAi.js";
import useGetAiMessages from "../../hooks/robot/useGetAiMessages.js";
import Message from "../../components/robotComponents/Message.jsx";
import MessageSkeleton from "../../components/chatComponents/MessageSkeleton.jsx";
import { SocketContext } from "../../context/SocketContext.jsx";

const Robot = () => {
  const { socket } = useContext(SocketContext);

  const [conversation, setConversation] = useState([]);
  const [myMessage, setMyMessage] = useState({ message: "", id: "" });
  const [tempUser, setTempUser] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const { getChatLoading, getMessages } = useGetAiMessages();
  const { loading, sendMessage } = useSendToAi();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const chatContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const topSentinelRef = useRef(null);
  const isPrepending = useRef(false);
  const prevScrollHeight = useRef(0);
  const isInitialLoad = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  {
    /*Scroll Handling*/
  }

  const handleScroll = () => {
    const el = chatContainerRef.current;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    if (isPrepending.current) {
      const container = chatContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight - prevScrollHeight.current;
      }
      isPrepending.current = false;
    } else if (isInitialLoad.current) {
      lastMessageRef.current?.scrollIntoView({ behavior: "instant" });
      isInitialLoad.current = false;
    } else if (isAtBottom) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [conversation]);

  const loadMoreMessages = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const container = chatContainerRef.current;
    if (container) prevScrollHeight.current = container.scrollHeight;
    isPrepending.current = true;
    const data = await getMessages(nextPage);
    setConversation((prev) => [...data.messages, ...prev]);
    setHasMore(data.hasMore);
    setPage(nextPage);
    setLoadingMore(false);
  };

  useEffect(() => {
    if (!topSentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreMessages();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(topSentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  {
    /* Send message */
  }
  const handleSendMessage = async (e) => {
    e.preventDefault();
    await sendMessage(myMessage);
    setMyMessage({ ...myMessage, message: "" });
  };

  {
    /* Get message */
  }
  useEffect(() => {
    const handleGetMessages = async () => {
      isInitialLoad.current = true;
      setChatLoading(true);
      const data = await getMessages(1);
      setConversation(data.messages);
      setHasMore(data.hasMore);
      setPage(1);
      setChatLoading(false);
    };
    handleGetMessages();
  }, []);

  {
    /*socket stuff */
  }
  useEffect(() => {
    if (!socket) return;

    const handleUserSocketId = (data) => {
      setTempUser(data.id);
    };

    socket.on("userSocketId", handleUserSocketId);
    socket.emit("requestUserInfo");

    socket.on(`newMessage-ai`, async (newMessage) => {
      setConversation((prev) => [...prev, newMessage]);
    });

    socket.on("is-ai-thinking", (answer) => {
      setIsAiThinking(answer);
    });

    return () => {
      socket.off("userSocketId");
      socket.off(`newMessage-ai`);
      socket.off("is-ai-thinking");
    };
  }, [socket]);

  return (
    <>
      <Nav />
      <div className="h-screen overflow-auto flex flex-col">
        {/* chat container */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex flex-col w-full lg:mx-auto xl:w-4/6 overflow-auto p-3 xl:px-3 text-xl"
        >
          <div className="mt-28 md:mt-40"></div>
          <div ref={topSentinelRef} />
          {loadingMore && (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {chatLoading
            ? Array(5)
                .fill(0)
                .map((_, i) => <MessageSkeleton key={i} />)
            : conversation.map((msg) => {
            return (
              <Message
                key={msg._id}
                img={`/profiles/${
                  msg.senderId
                    ? msg.senderId.profilePic
                    : msg.isAi
                    ? "ai"
                    : "defaultPic"
                }.png`}
                username={
                  msg.senderId
                    ? `HUMAN-${msg.senderId.humanNum}`
                    : msg.isAi
                    ? "ZDM-AI"
                    : `GUEST-${msg.tempUser.slice(0, 10)}`
                }
                message={msg.message}
                time={dayjs(msg.createdAt).fromNow()}
              />
            );
          })}
          <div ref={lastMessageRef} />
          <div className="mb-40"></div>
        </div>

        {/* chat inputs */}
        {isAiThinking && (
          <div className="bottom-36 left-10 lg:left-1/3 fixed justify-center">
            <p className="md:text-lg lg:text-xl bg-neutral-900 rounded-full px-5 py-3">🤖ZDM-AI IS THINKING...</p>
          </div>
        )}
        <form
          onSubmit={handleSendMessage}
          className="z-50 flex items-center justify-center"
        >
          <div className="fixed flex flex-row justify-between rounded-full py-3 gap-1 w-full lg:w-1/2 bottom-16 md:bottom-10 ">
            <input
              className="resize-none bg-black overflow-auto scrollbar-hide w-3/4 md:h-20 h-14  rounded-full p-5 text-xl font-mono border-2  border-b-fuchsia-600 border-l-fuchsia-400 border-r-fuchsia-400  outline-none placeholder:text-xs md:placeholder:text-lg"
              type="text"
              placeholder="!!!Call Ai with: zdm or ai"
              value={myMessage.message}
              disabled={isAiThinking}
              onChange={(e) =>
                setMyMessage({
                  message: e.target.value,
                  id: tempUser,
                })
              }
            />
            <button
              className={`w-1/4 bg-black border-2 border-b border-l-fuchsia-400 border-b-fuchsia-400 rounded-full text-2xl transition duration-300 ease-out ${
                (!loading || !isAiThinking) &&
                " lg:hover:bg-white lg:hover:text-black active:bg-black active:text-white"
              } xl:w-1/4 cursor-pointer`}
              disabled={loading || isAiThinking}
            >
              {loading || isAiThinking ? (
                <div className=" w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin m-auto" />
              ) : (
                "SEND"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Robot;
