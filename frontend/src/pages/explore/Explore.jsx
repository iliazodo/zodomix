import React, { useEffect, useMemo, useRef, useState } from "react";
import Nav from "../../components/Nav.jsx";
import Group from "../../components/exploreCompnents/Group.jsx";
import useGetGroups from "../../hooks/group/useGetGroups.js";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import ContentLoader from "react-content-loader";
import { CopyPlus } from "lucide-react";
import { getCategoryColor } from "../../components/CategoryTagInput.jsx";

const Explore = () => {
  const { loading, getGroups } = useGetGroups();

  const [groups, setGroups] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showSearch, setShowSearch] = useState(true);

  const scrollRef = useRef(null);
  const catRowRef = useRef(null);
  const lastScroll = useRef(0);

  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  const handleGetGroups = async () => {
    const data = await getGroups();
    setGroups(data);
  };

  const handleAddGroup = () => {
    if (authUser) {
      navigate("/addGroup");
    } else {
      toast.error("PLEASE LOGIN OR SIGNUP");
    }
  };

  // Build unique category list from groups that actually have categories
  const availableCategories = useMemo(() => {
    const cats = new Set();
    groups.forEach((g) => (g.categories || []).forEach((c) => cats.add(c)));
    return Array.from(cats).sort();
  }, [groups]);

  // Apply both filters
  const filteredGroups = useMemo(() => {
    return (groups || []).filter((group) => {
      const matchesSearch =
        !searchInput ||
        group.name.toLowerCase().includes(searchInput.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" ||
        (group.categories || []).includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [groups, searchInput, selectedCategory]);

  // Scroll hide/show logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScroll = container.scrollTop;
      if (currentScroll > lastScroll.current && currentScroll > 50) {
        setShowSearch(false);
      } else {
        setShowSearch(true);
      }
      lastScroll.current = currentScroll;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Skeleton loader
  const GroupLoader = () => (
    <div className="p-3 md:p-4 lg:p-5 w-[calc(100%-24px)] md:w-[calc(100%-32px)] lg:w-[calc(100%-40px)] m-auto">
      <ContentLoader
        speed={2}
        width="100%"
        height={320}
        viewBox="0 0 600 320"
        backgroundColor="#2c2c2c"
        foregroundColor="#999"
        className="w-full"
      >
        <rect x="0" y="0" rx="8" ry="8" width="600" height="30" />
        <circle cx="80" cy="100" r="50" />
        <rect x="160" y="70" rx="8" ry="8" width="300" height="30" />
        <rect x="160" y="110" rx="6" ry="6" width="200" height="20" />
        <rect x="0" y="170" rx="8" ry="8" width="600" height="20" />
        <rect x="0" y="200" rx="8" ry="8" width="550" height="20" />
        <rect x="0" y="250" rx="25" ry="25" width="450" height="45" />
        <rect x="470" y="250" rx="25" ry="25" width="120" height="45" />
      </ContentLoader>
    </div>
  );

  useEffect(() => {
    handleGetGroups();
  }, []);

  // Shared pill buttons used in both desktop (inline) and mobile (own row)
  const categoryPills = (
    <>
      <button
        type="button"
        onClick={() => setSelectedCategory("All")}
        className="flex-shrink-0 font-mono font-bold rounded-full px-3 py-1 transition-all duration-150 cursor-pointer"
        style={{
          fontSize: "0.72rem",
          border: selectedCategory === "All" ? "1px solid #00F2FF" : "1px solid rgba(255,255,255,0.15)",
          color: selectedCategory === "All" ? "#00F2FF" : "rgba(255,255,255,0.4)",
          background: selectedCategory === "All" ? "rgba(0,242,255,0.1)" : "transparent",
          boxShadow: selectedCategory === "All" ? "0 0 10px rgba(0,242,255,0.3)" : "none",
        }}
      >
        ALL
      </button>

      {availableCategories.map((cat) => {
        const color = getCategoryColor(cat);
        const active = selectedCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(active ? "All" : cat)}
            className="flex-shrink-0 font-mono rounded-full px-3 py-1 transition-all duration-150 cursor-pointer"
            style={{
              fontSize: "0.72rem",
              border: `1px solid ${active ? color : "rgba(255,255,255,0.12)"}`,
              color: active ? color : "rgba(255,255,255,0.35)",
              background: active ? `${color}12` : "transparent",
              boxShadow: active ? `0 0 10px ${color}44` : "none",
            }}
          >
            {cat}
          </button>
        );
      })}
    </>
  );

  return (
    <>
      <Nav />

      <div
        ref={scrollRef}
        className="overflow-auto h-screen flex flex-col sm:pt-40 pt-32"
      >
        {/* ── Sticky header ── */}
        <div
          className={`sticky lg:rounded-full border rounded-3xl border-gray-800 top-0 z-10 w-full flex flex-col transition-all duration-300 ease-in-out
            ${showSearch ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"}`}
          style={{ background: "linear-gradient(to bottom, #000 88%, transparent)" }}
        >
          {/* Row: [search] [pills — desktop only, middle] [add button] */}
          <div className="flex flex-row items-center gap-2 md:gap-3 px-4 md:px-10 py-2 w-full">

            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for groups..."
              className="border-2 bg-black text-sm md:text-base py-2 md:py-2.5 px-4 md:px-5 rounded-full outline-none flex-1 md:flex-none md:w-52"
            />

            {/* Pills — desktop only, sits between search and add button */}
            {availableCategories.length > 0 && (
              <div
                className="hidden md:flex flex-row gap-2 overflow-x-auto flex-1 min-w-0"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {categoryPills}
              </div>
            )}

            <button
              onClick={handleAddGroup}
              className="ml-auto flex-shrink-0 bg-black border-2 font-bold rounded-full py-2 md:py-2.5 px-3 md:px-5 transition duration-300 ease-out hover:bg-white hover:text-black active:bg-black active:text-white cursor-pointer"
            >
              <CopyPlus className="h-5 w-5 md:h-6 md:w-6" />
            </button>

          </div>

          {/* Pills — mobile only, own row below search */}
          {availableCategories.length > 0 && (
            <div
              className="flex md:hidden flex-row gap-2 overflow-x-auto px-4 pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categoryPills}
            </div>
          )}
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 pb-32 pt-8 md:pt-10 lg:pb-20 lg:pt-10 gap-8 md:gap-12 lg:gap-16">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <GroupLoader key={i} />)
          ) : filteredGroups.length > 0 ? (
            filteredGroups.map((group) => <Group key={group._id} {...group} />)
          ) : (
            <div
              className="col-span-full flex flex-col items-center justify-center py-24 gap-3"
            >
              <span
                className="pixel-font text-2xl"
                style={{ color: "rgba(255,255,255,0.1)" }}
              >
                NO GROUPS FOUND
              </span>
              <span
                className="font-mono text-sm"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                {selectedCategory !== "All"
                  ? `No groups tagged with "${selectedCategory}"`
                  : "Try a different search"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Explore;
