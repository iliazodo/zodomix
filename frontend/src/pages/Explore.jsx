import React, { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav.jsx";
import Group from "../components/exploreCompnents/Group.jsx";
import useGetGroups from "../hooks/group/useGetGroups.js";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import ContentLoader from "react-content-loader";
import { CopyPlus } from 'lucide-react';


const Explore = () => {
  const { loading, getGroups } = useGetGroups();

  const [groups, setGroups] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  const scrollRef = useRef(null);
  const lastScroll = useRef(0);

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

  // Scroll hide/show logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScroll = container.scrollTop;

      if (currentScroll > lastScroll.current && currentScroll > 50) {
        setShowSearch(false); // scrolling down
      } else {
        setShowSearch(true); // scrolling up
      }

      lastScroll.current = currentScroll;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Skeleton loader
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

      <div
        ref={scrollRef}
        className="overflow-auto h-screen flex flex-col sm:pt-32 pt-28"
      >
        {/* Search + Add */}
        <div
          className={`sticky justify-center top-0 z-10 flex flex-row md:flex-row md:px-10 xl:mx-auto xl:w-1/2 w-full gap-2 md:gap-5
          transition-all duration-300 ease-in-out
          ${showSearch ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"}`}
        >
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="You can search for groups here..."
            className="border-2 bg-black text-sm md:text-lg lg:text-2xl py-2 md:py-3 lg:py-2 px-4 md:px-6 lg:px-7 rounded-full w-4/5 outline-none"
          />
          <button
            onClick={handleAddGroup}
            className="bg-black border-2 font-bold rounded-full md:py-3 lg:py-2 px-2 md:px-6 lg:px-7 transition duration-300 ease-out hover:bg-white hover:text-black active:bg-black active:text-white cursor-pointer"
          >
            <CopyPlus className="h-6 w-6 md:h-9 md:w-9"/>
          </button>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 pb-32 pt-8 md:pt-10 lg:pb-20 lg:pt-10 gap-8 md:gap-12 lg:gap-16">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, i) => <GroupLoader key={i} />)
            : !searchInput
              ? groups?.map((group) => <Group key={group._id} {...group} />)
              : groups
                  .filter((group) =>
                    group.name
                      .toLowerCase()
                      .includes(searchInput.toLowerCase()),
                  )
                  .map((group) => <Group key={group._id} {...group} />)}
        </div>
      </div>
    </>
  );
};

export default Explore;
