import React, { useEffect, useState } from "react";

import Nav from "../components/Nav.jsx";
import Group from "../components/exploreCompnents/Group.jsx";
import useGetGroups from "../hooks/useGetGroups.js";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const Explore = () => {
  const { getGroups } = useGetGroups();

  const [groups, setGroups] = useState([]);

  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  const handleGetGroups = async () => {
    const data = await getGroups();
    setGroups(data);
  };

  const handleAddGroup = async () => {
    if(authUser){
      navigate("/addGroup");
    } else {
      toast.error("PLEASE LOGIN OR SIGNUP");
    }

  };

  useEffect(() => {
    handleGetGroups();
  }, []);

  return (
    <>
      <Nav />

      <div className="overflow-auto h-screen flex flex-col md:grid-cols-2 xl:grid-cols-3 sm:pt-32 pt-28">
        <div className="flex flex-row">
          <button
            onClick={handleAddGroup}
            className="m-auto py-2 bg-transparent border-2 rounded-full text-2xl transition duration-300 ease-out hover:bg-white hover:text-black active:bg-black active:text-white xl:w-1/2 w-4/5 xl:m-auto cursor-pointer"
          >
            ADD GROUP
          </button>
        </div>
        <div className="overflow-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 pb-32 pt-10 lg:pb-20 lg:pt-10 gap-16">
          {groups.map((group) => (
            <Group
              key={group._id}
              id={group._id}
              name={group.name}
              description={group.description}
              picture={group.picture}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Explore;
