import React, { useContext, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import Nav from "../components/Nav.jsx";
import useSendToAi from "../hooks/robot/useSendToAi.js";
import useGetAiMessages from "../hooks/robot/useGetAiMessages.js";
import Message from "../components/chatComponents/Message.jsx";
import { SocketContext } from "../context/SocketContext";

const Robot = () => {
  const { socket } = useContext(SocketContext);

  const [conversation, setConversation] = useState([]);
  const [myMessage, setMyMessage] = useState({ message: "", id: "" });
  const [tempUser, setTempUser] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const { getChatLoading, getMessages } = useGetAiMessages();
  const { loading, sendMessage } = useSendToAi();

  const chatContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
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
    if (isAtBottom) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [conversation]);

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
      const data = await getMessages();
      setConversation(data);
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
        {/* chat loading */}
        {getChatLoading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className=" w-48 h-48 border-4 border-white border-t-transparent rounded-full animate-spin m-auto" />
          </div>
        )}

        {/* chat container */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex flex-col w-full lg:mx-auto xl:w-4/6 overflow-auto p-3 xl:px-3 text-xl"
        >
          <div className="mt-28 md:mt-40"></div>
          {conversation.map((msg) => {
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
              placeholder="!!!Call Ai with: zdm , ai or bot"
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
