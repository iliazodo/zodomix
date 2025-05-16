import React, { useEffect, useRef, useState } from "react";

import Nav from "../components/Nav.jsx";
import "./custom.css";
import useSendMessages from "../hooks/useSendMessages.js";
import useGetMessages from "../hooks/useGetMessages.js";
import io from "socket.io-client";
import Message from "../components/Message.jsx";
import AlertMessage from "../components/AlertMessage.jsx";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const ChatZone = () => {
  const { socket } = useContext(SocketContext);
  const [chatLoading, setChatLoading] = useState(false);
  const [myMessage, setMyMessage] = useState({ message: "", id: "", pic: "" });
  const [conversation, setConversation] = useState([]);
  const [tempInfo, setTempInfo] = useState({ id: "", pic: "" });
  const { loading, sendMessage } = useSendMessages();
  const { getMessages } = useGetMessages();

  const currGroup = JSON.parse(localStorage.getItem("zdm-group")) || "ALL";

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await sendMessage(myMessage, currGroup);

    setMyMessage({ message: "" });
  };

  const lastMessageRef = useRef(null);
  const chatContainerRef = useRef(null);
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

  useEffect(() => {
    setChatLoading(true);

    const gettingMessages = async () => {
      const data = await getMessages(currGroup);

      setConversation(data);
      setChatLoading(false);
    };

    gettingMessages();
  }, []);

  {
    /*socket stuff */
  }
  useEffect(() => {
    // const socket = io("http://localhost:3030");
    if (!socket) return; // <-- wait for socket to be initialized

    const handleUserSocketId = (data) => {
      setTempInfo({ id: data.id, pic: data.pic });
      console.log("Received:", data);
    };

    socket.on("userSocketId", handleUserSocketId);
    socket.emit("requestUserInfo");

    socket.on(`newMessage-${currGroup}`, async (newMessage) => {
      setConversation((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("userSocketId");
      socket.off(`newMessage-${currGroup}`);
    };
  }, [socket]);

  return (
    <>
      <Nav />
      <div className="h-screen overflow-auto flex flex-col">
        {/* chat name */}
        <AlertMessage message={currGroup} />

        {/* chat loading */}
        {chatLoading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className=" w-48 h-48 border-4 border-white border-t-transparent rounded-full animate-spin m-auto" />
          </div>
        )}

        {/* chat container */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex flex-col w-full overflow-auto xl:px-64 p-3 text-xl"
        >
          <div className="mt-28 md:mt-40"></div>
          {conversation.map((msg) => {
            return (
              <Message
                key={msg._id}
                img={`/profiles/${
                  msg.senderId ? msg.senderId.profilePic : msg.tempPic
                }.png`}
                username={`${
                  msg.senderId
                    ? "HUMAN-" + msg.senderId.humanNum
                    : "GUEST-" + msg.tempUser.slice(0 , 10)
                }`}
                message={msg.message}
              />
            );
          })}
          <div ref={lastMessageRef} />
          <div className="mb-40"></div>
        </div>
        {/* chat inputs */}
        <form onSubmit={handleSendMessage} className="">
          <div className="fixed flex flex-row justify-between bg-black py-3 gap-1 w-full bottom-20 md:bottom-0">
            <input
              className="resize-none overflow-auto scrollbar-hide w-3/4 md:h-20 h-14 bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
              type="text"
              value={myMessage.message}
              onChange={(e) =>
                setMyMessage({
                  message: e.target.value,
                  id: tempInfo.id,
                  pic: tempInfo.pic,
                })
              }
            />
            <button
              className={`w-1/4 bg-transparent border-2 rounded-full text-2xl transition duration-300 ease-out ${
                !loading &&
                " lg:hover:bg-white lg:hover:text-black active:bg-black active:text-white"
              } xl:w-1/4 cursor-pointer`}
              disabled={loading}
            >
              {loading ? (
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

export default ChatZone;
