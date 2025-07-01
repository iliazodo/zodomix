import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAddFavGroup from "../../hooks/group/useAddFavGroup.js";
import useGetFavGroups from "../../hooks/group/useGetFavGroups.js";
import { useAuthContext } from "../../context/AuthContext.jsx";

const Group = (props) => {
  const [isFavGroup, setIsFavGroup] = useState(false);
  const [favLoading, setFavLoading] = useState(true);

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
    }
  }, []);

  return (
    <div className="p-5 flex flex-col border-2 border-white border-l-fuchsia-600 border-b-fuchsia-600 rounded-3xl w-[calc(100%-50px)] m-auto">
      <div className="flex flex-row justify-center items-center gap-7 xl:gap-30">
        <img
          src={`/groups/${props.picture}.png`}
          alt="profle"
          className="rounded-full border-2 border-white w-24 h-24"
        />
        <h3 className="text-2xl lg:text-3xl text-center font-bold">
          {props.name}
        </h3>
        <span className="">{props.messageCount}</span>
      </div>
      <p className="p-5">{props.description}</p>
      <div className="w-full flex flex-row gap-5">
        <button
          onClick={handleJoin}
          className="py-2 bg-transparent border-2 rounded-full text-2xl transition duration-300 ease-out hover:bg-white hover:text-black active:bg-black active:text-white w-4/5 xl:m-auto cursor-pointer"
        >
          JOIN
        </button>
        <button
          onClick={handleFav}
          className={` border-2 rounded-full text-4xl transition duration-300 ease-out md:hover:bg-white md:hover:text-black active:bg-black active:text-white w-1/5 xl:m-auto cursor-pointer
          `}
        >
          { favLoading ? <div className=" w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin m-auto" /> : (isFavGroup ? "♥︎" : "♡") }
        </button>
      </div>
    </div>
  );
};

export default Group;
