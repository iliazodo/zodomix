import React, { useEffect, useRef, useState } from "react";

import Nav from "../components/Nav.jsx";
import "./chatBubble.css";
import useSendMessages from "../hooks/useSendMessages.js";
import useGetMessages from "../hooks/useGetMessages.js";
import useGetUser from "../hooks/useGetUser.js";
import io from "socket.io-client";
import Message from "../components/Message.jsx";

const ChatZone = () => {
  const { getUser } = useGetUser();
  const [chatLoading , setChatLoading] = useState(false);
  const [myMessage, setMyMessage] = useState({ message: "" });
  const [conversation, setConversation] = useState([]);

  const { loading, sendMessage } = useSendMessages();
  const { getMessages } = useGetMessages();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const currGroup = JSON.parse(localStorage.getItem("zdm-group"));
    await sendMessage(myMessage, currGroup);

    setMyMessage({ message: "" });
  };

  const lastMessageRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  {/*Scroll Handling*/}

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
      const currGroup = JSON.parse(localStorage.getItem("zdm-group"));
      const data = await getMessages(currGroup);

      const conversationWithUsers = await Promise.all(
        data.map(async (element) => {
          const user = await getUser(element.senderId);
          return {
            id: element._id,
            message: element.message,
            username: user.username,
            profilePic: user.profilePic,
          };
        })
      );

      setConversation(conversationWithUsers);
      setChatLoading(false)
    };

    gettingMessages();
    
  }, []);

  {
    /*socket stuff */
  }
  useEffect(() => {
    const currGroup = JSON.parse(localStorage.getItem("zdm-group"));
    const socket = io("https://zodomix.com");

    socket.on(`newMessage-${currGroup}`, async (newMessage) => {
      const user = await getUser(newMessage.senderId);
      setConversation((prev) => [
        ...prev,
        {
          id: newMessage._id,
          message: newMessage.message,
          username: user.username,
          profilePic: user.profilePic,
        },
      ]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Nav />
      <div className="h-screen overflow-auto flex flex-col">
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
          className="flex flex-col w-full overflow-auto mt-28 md:mt-40 mb-40 p-3 text-xl"
        >
          {conversation.map((msg) => {
            return (
              <Message
                key={msg.id}
                img={`/public/profiles/${msg.profilePic}.png`}
                username={msg.username}
                message={msg.message}
              />
            );
          })}
          <div ref={lastMessageRef} />
        </div>
        {/* chat inputs */}
        <form onSubmit={handleSendMessage} className="">
          <div className="fixed flex flex-row justify-between bg-black py-3 gap-1 w-full bottom-20 md:bottom-0">
            <input
              className="resize-none overflow-auto scrollbar-hide w-3/4 h-20 bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
              type="text"
              value={myMessage.message}
              onChange={(e) => setMyMessage({ message: e.target.value })}
            />
            <button
              className={`w-1/4 bg-transparent border-2 rounded-full text-2xl transition duration-300 ease-out ${
                !loading &&
                " hover:bg-white hover:text-black active:bg-black active:text-white"
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
