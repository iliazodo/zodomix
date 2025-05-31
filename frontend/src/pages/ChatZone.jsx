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
import { Link, useNavigate } from "react-router-dom";
import useGetFavGroups from "../hooks/useGetFavGroups.js";
import { useAuthContext } from "../context/AuthContext.jsx";

const ChatZone = () => {
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const [chatLoading, setChatLoading] = useState(false);
  const [myMessage, setMyMessage] = useState({ message: "", id: "", pic: "" });
  const [conversation, setConversation] = useState([]);
  const [tempInfo, setTempInfo] = useState({ id: "", pic: "" });
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem("zdm-chat-history");
    return stored ? JSON.parse(stored).reverse() : [];
  });

  const [favGroups, setFavGroups] = useState([]);

  const { loading, sendMessage } = useSendMessages();
  const { getMessages } = useGetMessages();
  const { favLoading, getFavGroups } = useGetFavGroups();
  const { authUser } = useAuthContext();

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

  {
    /* getting messages */
  }

  useEffect(() => {
    setChatLoading(true);

    const gettingMessages = async () => {
      const data = await getMessages(currGroup);

      setConversation(data);
      setChatLoading(false);
    };

    gettingMessages();
  }, [navigate]);

  {
    /*socket stuff */
  }
  useEffect(() => {
    if (!socket) return;

    const handleUserSocketId = (data) => {
      setTempInfo({ id: data.id, pic: data.pic });
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

  {
    /* getting favorite groups */
  }

  useEffect(() => {
    const gettingFav = async () => {
      const data = await getFavGroups();
      setFavGroups(data);
    };

    if (authUser) {
      gettingFav();
    }
  }, []);

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

        {/* history */}
        <div className="fixed left-5 top-32 w-[calc(16%-10px)] h-5/6 overflow-hidden xl:block hidden border-white border-2 border-l-fuchsia-600 rounded-3xl mx-auto p-3 break-words">
          <h2 className="text-center 2xl:text-2xl xl:text-xl pixel-font border-b-2 pb-3">
            HISTORY
          </h2>
          <div className="grid grid-cols-2 overflow-auto">
            {history.map((group, index) => {
              return (
                <Link
                  className=" hover:scale-90 hover:border-white hover:border-2 hover:rounded-lg"
                  to={`/chatZone/:${group.name}`}
                  key={index}
                  onClick={() => {
                    localStorage.setItem(
                      "zdm-group",
                      JSON.stringify(group.name)
                    );
                  }}
                >
                  <img
                    src={`/groups/${group.pic}.png`}
                    alt={group.name}
                    className="rounded-full"
                  />
                  <p className="text-center max-w-32 overflow-hidden">
                    {group.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* favorite */}
        <div className="fixed right-5 top-32 w-[calc(16%-10px)] h-5/6 overflow-hidden xl:block hidden border-white border-2 border-r-fuchsia-600 rounded-3xl mx-auto p-3 break-words">
          <h2 className="text-center 2xl:text-2xl xl:text-xl pixel-font border-b-2 pb-3">
            FAVORITE
          </h2>
          <div className="grid grid-cols-2 mx-auto">
            {favLoading ? (
              <div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className=" w-24 h-24 border-4 border-white border-t-transparent rounded-full animate-spin m-auto" />
                </div>
              </div>
            ) : (
              Array.isArray(favGroups) &&
              favGroups.map((group, index) => {
                return (
                  <Link
                    className=" hover:scale-90 hover:border-white hover:border-2 hover:rounded-lg"
                    to={`/chatZone/:${group.groupName}`}
                    key={index}
                    onClick={() => {
                      localStorage.setItem(
                        "zdm-group",
                        JSON.stringify(group.groupName)
                      );
                    }}
                  >
                    <img
                      src={`/groups/${group.groupPic}.png`}
                      alt={group.groupName}
                      className="rounded-full"
                    />
                    <p className="text-center max-w-32 overflow-hidden">
                      {group.groupName}
                    </p>
                  </Link>
                );
              })
            )}
          </div>
        </div>

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
                  msg.senderId ? msg.senderId.profilePic : "defaultPic"
                }.png`}
                username={`${
                  msg.senderId
                    ? "HUMAN-" + msg.senderId.humanNum
                    : "GUEST-" + msg.tempUser.slice(0, 10)
                }`}
                message={msg.message}
              />
            );
          })}
          <div ref={lastMessageRef} />
          <div className="mb-40"></div>
        </div>

        {/* chat inputs */}
        <form
          onSubmit={handleSendMessage}
          className="z-50 flex items-center justify-center"
        >
          <div className="fixed flex flex-row justify-between rounded-full py-3 gap-1 w-full lg:w-1/2 bottom-16 md:bottom-10 ">
            <input
              className="resize-none bg-black overflow-auto scrollbar-hide w-3/4 md:h-20 h-14  rounded-full p-5 text-2xl font-mono border-2  border-b-fuchsia-600 border-l-fuchsia-400 border-r-fuchsia-400  outline-none"
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
              className={`w-1/4 bg-black border-2 border-b border-l-fuchsia-400 border-b-fuchsia-400 rounded-full text-2xl transition duration-300 ease-out ${
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
