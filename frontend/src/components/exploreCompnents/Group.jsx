import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAddFavGroup from "../../hooks/group/useAddFavGroup.js";
import useGetFavGroups from "../../hooks/group/useGetFavGroups.js";
import { useAuthContext } from "../../context/AuthContext.jsx";
import "../../pages/custom.css"

const Group = (props) => {
  const [isFavGroup, setIsFavGroup] = useState(false);
  const [favLoading, setFavLoading] = useState(true);
  const [currentGroup , setCurrentGroup] = useState(JSON.parse(localStorage.getItem("zdm-group")));

  const navigate = useNavigate();

  const { addFavGroup } = useAddFavGroup();
  const { getFavGroups } = useGetFavGroups();
  const { authUser } = useAuthContext();

  const handleJoin = () => {
    localStorage.setItem("zdm-group", JSON.stringify(props.name));
    navigate(`/chatZone/${props.name}`);

    // Add group to history
    let existing = JSON.parse(localStorage.getItem("zdm-chat-history")) || [];
    existing.push({ name: props.name, pic: props.picture });
    localStorage.setItem("zdm-chat-history", JSON.stringify(existing));
  };

  const handleFav = async () => {
    if (authUser) {
      isFavGroup ? setIsFavGroup(false) : setIsFavGroup(true);
    }
    await addFavGroup(props.id);
  };

  useEffect(() => {
    const gettingFav = async () => {
      try {
        const data = await getFavGroups();

        data.map((group) => {
          if (group.groupName === props.name) {
            setIsFavGroup(true);
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

  return (
    <div className="showUpAnimate p-3 md:p-4 lg:p-5 flex flex-col bg-black border-4 border-t-cyan-300 border-r-green-300 border-l-fuchsia-300 border-b-yellow-300 rounded-3xl w-[calc(100%-24px)] md:w-[calc(100%-32px)] lg:w-[calc(100%-40px)] m-auto">
      {props.groupType === "main" ? (<div className="w-full bg-yellow-500 mb-2"><p className="text-center m-auto text-black font-bold text-xs md:text-sm">Main Group</p></div>) : (<div className="w-full bg-green-500 mb-2"><p className="text-center m-auto text-black font-bold text-xs md:text-sm">User Created Group</p></div>)}
      <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 lg:gap-7">
        <img
          src={`/groups/${props.picture}.png`}
          alt="profle"
          className="rounded-full border-2 border-white w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
        />
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg md:text-xl lg:text-3xl text-center md:text-left font-bold">
            {props.name}
          </h3>
          <span className="text-xs md:text-sm lg:text-base font-bold">{props.messageCount} Messages</span>
        </div>
      </div>
      <p className="p-3 md:p-4 text-xs font-bold text-gray-400 md:text-sm lg:text-base ">{props.description}</p>
      <div className="w-full flex flex-row gap-2 md:gap-3 lg:gap-4">
        <button
          onClick={handleJoin}
          className="py-2 md:py-2 bg-black lg:py-3 border-2 rounded-full text-xs md:text-sm lg:text-xl font-semibold transition duration-300 ease-out hover:bg-white hover:text-black active:bg-black active:text-white w-4/5 xl:m-auto cursor-pointer"
        >
          {currentGroup === props.name ? "IN" : "JOIN"}
        </button>
        <button
          onClick={handleFav}
          className={`border-2 bg-black rounded-full text-2xl md:text-2xl lg:text-4xl transition duration-300 ease-out md:hover:bg-white md:hover:text-black active:bg-black active:text-white w-1/5 xl:m-auto cursor-pointer flex items-center justify-center`}
        >
          { favLoading ? <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (isFavGroup ? "♥︎" : "♡") }
        </button>
      </div>
    </div>
  );
};

export default Group;
