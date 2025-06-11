import React, { useEffect, useState } from "react";

import Nav from "../components/Nav.jsx";
import Group from "../components/exploreCompnents/Group.jsx";
import useGetGroups from "../hooks/useGetGroups.js";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import ContentLoader from "react-content-loader";

const Explore = () => {
  const { loading, getGroups } = useGetGroups();

  const [groups, setGroups] = useState([]);
  const [searchInput, setSearchInput] = useState();

  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  const handleGetGroups = async () => {
    const data = await getGroups();
    setGroups(data);
  };

  const handleAddGroup = async () => {
    if (authUser) {
      navigate("/addGroup");
    } else {
      toast.error("PLEASE LOGIN OR SIGNUP");
    }
  };

  // Group loader skeletone

  const GroupLoader = () => (
    <ContentLoader
      speed={2}
      width={350}
      height={160}
      viewBox="0 0 350 160"
      backgroundColor="#2c2c2c"
      foregroundColor="#999"
      className="mx-auto"
    >
      <rect x="0" y="0" rx="12" ry="12" width="350" height="100" />
      <rect x="0" y="110" rx="6" ry="6" width="220" height="15" />
      <rect x="0" y="135" rx="6" ry="6" width="180" height="15" />
    </ContentLoader>
  );

  useEffect(() => {
    handleGetGroups();
  }, []);

  return (
    <>
      <Nav />

      <div className="overflow-auto h-screen flex flex-col md:grid-cols-2 xl:grid-cols-3 sm:pt-32 pt-28">
        <div className="flex flex-col md:flex-row md:px-10 xl:mx-auto xl:w-1/2  w-full gap-5">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search..."
            className="m-auto border-2 bg-transparent text-2xl py-2 lg:py-5 px-7 rounded-full w-4/5   outline-none"
          />
          <button
            onClick={handleAddGroup}
            className="m-auto xl: py-2 lg:py-5 bg-transparent border-2 rounded-full text-2xl transition duration-300 ease-out hover:bg-white hover:text-black active:bg-black active:text-white  w-2/5 cursor-pointer"
          >
            ADD GROUP
          </button>
        </div>
        <div className="overflow-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 pb-32 pt-10 lg:pb-20 lg:pt-10 gap-16">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, i) => <GroupLoader key={i} />)
            : !searchInput
            ? groups.map((group) => (
                <Group
                  key={group._id}
                  id={group._id}
                  name={group.name}
                  description={group.description}
                  picture={group.picture}
                />
              ))
            : groups
                .filter((group) =>
                  group.name
                    .toLowerCase()
                    .includes((searchInput || "").toLowerCase())
                )
                .map((group) => (
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
