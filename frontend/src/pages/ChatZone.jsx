import React, { useEffect, useState } from "react";

import Nav from "../components/Nav.jsx";
import "./chatBubble.css";
import useSendMessages from "../hooks/useSendMessages.js";
import useGetMessages from "../hooks/useGetMessages.js";
import useGetUser from "../hooks/useGetUser.js";
import io from "socket.io-client";

const ChatZone = () => {
  const { getUser } = useGetUser();
  const socket = io();

  const [myMessage, setMyMessage] = useState({ message: "" });
  const [conversation, setConversation] = useState([]);

  const { loading, sendMessage } = useSendMessages();
  const { getMessages } = useGetMessages();

  const handleSendMessage = async () => {
    await sendMessage(myMessage , "all");
    
    socket.emit("NEW MESSAGE" , myMessage);

    setMyMessage({ message: "" });
  };

  useEffect(() => {
    const gettingMessages = async () => {
      const data = await getMessages("all");
  
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
    };
  
    gettingMessages();
  }, [socket.on("NEW MESSAGE")]);


  

  return (
    <>
      <Nav />
      <div className="h-screen overflow-auto flex flex-col">
        {/* chat container */}
        <div className="flex flex-col w-full overflow-auto mt-20 mb-40 p-3 bg-neutral-950 text-xl">
          {conversation.map((msg) => (
            <div key={msg.id} className="flex flex-row z-0">
              <img
                src={`profiles/${msg.profilePic}.png`}
                className="rounded-full w-16 h-16"
              />
              <div className="flex flex-col">
                <p>{msg.username}</p>
                <div className="bubble grow left break-words max-w-96 min-w-52">
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* chat inputs */}
        <div className="fixed flex flex-row justify-between bg-black py-3 gap-1 w-full bottom-20">
          <textarea
            className="resize-none overflow-auto scrollbar-hide w-3/4 h-20 bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
            type="text"
            value={myMessage.message}
            onChange={(e) => setMyMessage({ message: e.target.value })}
          />
          <button
            onClick={handleSendMessage}
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
      </div>
    </>
  );
};

export default ChatZone;
