import React, { useEffect, useState } from "react";

import Nav from "../../components/Nav.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import useLogout from "../../hooks/auth/useLogout.js";
import useGetMyGroups from "../../hooks/group/useGetMyGroups.js";
import useDeleteGroup from "../../hooks/group/useDeleteGroup.js";
import useGetProfilePictures from "../../hooks/user/useGetProfilePictures.js";
import useUpdateProfile from "../../hooks/user/useUpdateProfile.js";
import { Link } from "react-router-dom";

const Profile = () => {
  const { authUser } = useAuthContext();
  const { loading, logout } = useLogout();
  const { groupLoading, getMyGroups } = useGetMyGroups();
  const { deleteLoading, deleteGroup } = useDeleteGroup();
  const { picturesLoading, getProfilePictures } = useGetProfilePictures();
  const { updateLoading, updateProfile } = useUpdateProfile();

  const [myGroups, setMyGroups] = useState([]);

  const [bioEditing, setBioEditing] = useState(false);
  const [bioValue, setBioValue] = useState(authUser.bio || "");

  const [pickerOpen, setPickerOpen] = useState(false);
  const [availablePics, setAvailablePics] = useState([]);
  const [selectedPic, setSelectedPic] = useState(authUser.profilePic);

  const [logoutHovered, setLogoutHovered] = useState(false);
  const [hoveredEdit, setHoveredEdit] = useState(null);
  const [hoveredDelete, setHoveredDelete] = useState(null);

  const handleLogout = async () => await logout();
  const handleEdit = () => {};

  const handleDelete = async (groupId) => {
    if (window.confirm("ARE YOU SURE TO DELETE THE GROUP?")) {
      await deleteGroup(groupId);
      gettingMyGroups();
    }
  };

  const gettingMyGroups = async () => {
    const data = await getMyGroups();
    setMyGroups(data);
  };

  const handleBioSave = async () => {
    await updateProfile({ bio: bioValue });
    setBioEditing(false);
  };

  const handleOpenPicker = async () => {
    if (availablePics.length === 0) {
      const pics = await getProfilePictures();
      pics.sort((a, b) => parseInt(a) - parseInt(b));
      setAvailablePics(pics);
    }
    setSelectedPic(authUser.profilePic);
    setPickerOpen(true);
  };

  const handlePicSave = async () => {
    await updateProfile({ profilePic: selectedPic });
    setPickerOpen(false);
  };

  useEffect(() => {
    gettingMyGroups();
  }, []);

  /* ── Reusable pieces ── */

  const Avatar = ({ size }) => (
    <div className="relative group cursor-pointer" onClick={handleOpenPicker}>
      <div style={{ padding: "3px", borderRadius: "50%", background: "linear-gradient(135deg, #00FF7B, #FF00EE)" }}>
        <img
          className="rounded-full block"
          src={`./profiles/${authUser.profilePic}.png`}
          alt="profile picture"
          style={{ width: size, height: size, background: "#000" }}
        />
      </div>
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: "rgba(0,0,0,0.65)" }}
      >
        <span className="font-mono text-xs" style={{ color: "#00F2FF" }}>CHANGE</span>
      </div>
    </div>
  );

  const BioSection = ({ textSize }) => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="font-mono font-bold" style={{ fontSize: textSize ?? "0.8rem", color: "#EAFF00", letterSpacing: "0.1em" }}>BIO</span>
        {!bioEditing && (
          <button
            onClick={() => setBioEditing(true)}
            className="font-mono cursor-pointer transition-all duration-200"
            style={{ fontSize: "0.75rem", color: "#00F2FF", border: "1px solid #00F2FF", borderRadius: "999px", padding: "2px 12px" }}
          >
            EDIT
          </button>
        )}
      </div>
      {bioEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={bioValue}
            onChange={(e) => setBioValue(e.target.value)}
            maxLength={150}
            rows={3}
            className="w-full bg-transparent font-mono resize-none outline-none rounded-xl p-3 text-left"
            style={{ fontSize: "0.9rem", border: "1px solid rgba(0,242,255,0.4)", color: "rgba(255,255,255,0.85)" }}
            placeholder="Write something about yourself..."
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setBioEditing(false); setBioValue(authUser.bio || ""); }}
              className="font-mono cursor-pointer rounded-full px-4 py-1.5 transition-all duration-200"
              style={{ fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.4)" }}
            >
              CANCEL
            </button>
            <button
              onClick={handleBioSave}
              disabled={updateLoading}
              className="font-mono font-bold cursor-pointer rounded-full px-4 py-1.5 transition-all duration-200"
              style={{ fontSize: "0.8rem", background: "#00FF7B", color: "#000", border: "1px solid #00FF7B" }}
            >
              {updateLoading ? "..." : "SAVE"}
            </button>
          </div>
        </div>
      ) : (
        <p
          className="font-mono rounded-xl p-3 min-h-[52px] text-left"
          style={{
            fontSize: "0.9rem",
            border: "1px solid rgba(255,255,255,0.06)",
            color: authUser.bio ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.2)",
            fontStyle: authUser.bio ? "normal" : "italic",
          }}
        >
          {authUser.bio || "No bio yet..."}
        </p>
      )}
    </div>
  );

  const GroupCard = ({ group, compact }) => (
    <div
      key={group._id}
      className="relative flex flex-row items-center gap-4 rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(0,242,255,0.25)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #00FF7B, #00F2FF, #FF00EE, #EAFF00)" }} />
      <div className="flex flex-row items-center gap-4 p-4 pt-5 w-full">
        <div style={{ padding: "2px", borderRadius: "50%", background: "linear-gradient(135deg, #00FF7B, #FF00EE)", flexShrink: 0 }}>
          <img
            src={`/groups/group-1.png`}
            className="rounded-full block"
            alt={group.name}
            style={{ width: compact ? "44px" : "52px", height: compact ? "44px" : "52px", background: "#000" }}
          />
        </div>
        <p className="pixel-font font-bold flex-1 truncate" style={{ fontSize: compact ? "0.9rem" : "1rem" }}>
          {group.name}
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <Link to={`/edit/${group._id}`}>
            <button
              onClick={handleEdit}
              onMouseEnter={() => setHoveredEdit(group._id)}
              onMouseLeave={() => setHoveredEdit(null)}
              className="rounded-full font-mono font-bold transition-all duration-200 cursor-pointer"
              style={{
                fontSize: compact ? "0.75rem" : "0.85rem",
                padding: compact ? "5px 12px" : "6px 16px",
                ...(hoveredEdit === group._id
                  ? { background: "#00FF7B", color: "#000", border: "1px solid #00FF7B", boxShadow: "0 0 12px #00FF7B88" }
                  : { background: "transparent", color: "#00FF7B", border: "1px solid #00FF7B" }),
              }}
            >
              Edit
            </button>
          </Link>
          <button
            onClick={() => handleDelete(group._id)}
            onMouseEnter={() => setHoveredDelete(group._id)}
            onMouseLeave={() => setHoveredDelete(null)}
            className="rounded-full font-mono font-bold transition-all duration-200 cursor-pointer"
            style={{
              fontSize: compact ? "0.75rem" : "0.85rem",
              padding: compact ? "5px 12px" : "6px 16px",
              ...(hoveredDelete === group._id
                ? { background: "#FF00EE", color: "#000", border: "1px solid #FF00EE", boxShadow: "0 0 12px #FF00EE88" }
                : { background: "transparent", color: "#FF00EE", border: "1px solid #FF00EE" }),
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const LogoutBtn = ({ fullWidth }) => (
    <button
      onClick={handleLogout}
      onMouseEnter={() => setLogoutHovered(true)}
      onMouseLeave={() => setLogoutHovered(false)}
      disabled={loading}
      className={`rounded-full font-mono font-bold transition-all duration-200 cursor-pointer ${fullWidth ? "w-full" : "w-full max-w-xs"}`}
      style={{
        fontSize: "1rem",
        padding: "13px 0",
        ...(loading
          ? { background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.3)" }
          : logoutHovered
          ? { background: "#EAFF00", color: "#000", border: "1px solid #EAFF00", boxShadow: "0 0 18px #EAFF0088" }
          : { background: "transparent", border: "1px solid #EAFF00", color: "#EAFF00" }),
      }}
    >
      {loading
        ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
        : "LOG OUT"}
    </button>
  );

  return (
    <>
      <Nav />
      <div className="bg-black min-h-screen pt-28 pb-16 flex flex-col items-center w-full px-4 md:px-8">

        {/* ════════════════════════════════════
            DESKTOP LAYOUT  (lg+)
        ════════════════════════════════════ */}
        <div
          className="hidden lg:mt-10 lg:flex flex-col w-full max-w-6xl rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(0,242,255,0.3)",
            boxShadow: "0 4px 48px rgba(0,0,0,0.7), 0 0 16px rgba(0,242,255,0.07)",
          }}
        >
          {/* Gradient top bar */}
          <div style={{ height: "3px", background: "linear-gradient(90deg, #00FF7B, #00F2FF, #FF00EE, #EAFF00)" }} />

          {/* Two-column body */}
          <div className="flex flex-row" style={{ minHeight: "520px" }}>

            {/* ── LEFT: Info ── */}
            <div
              className="flex flex-col gap-5 p-8"
              style={{
                width: "340px",
                flexShrink: 0,
                borderRight: "1px solid rgba(0,242,255,0.12)",
              }}
            >
              {/* Info box */}
              <div
                className="flex flex-col items-center gap-5 rounded-2xl p-6"
                style={{
                  border: "1px solid rgba(0,255,123,0.2)",
                  boxShadow: "0 0 12px rgba(0,255,123,0.04)",
                }}
              >
                <Avatar size="144px" />

                <div className="text-center w-full">
                  <h2
                    className="pixel-font font-bold"
                    style={{ fontSize: "1.75rem", color: "#fff", lineHeight: 1.2 }}
                  >
                    {authUser.username}
                  </h2>
                  <p className="font-mono mt-1" style={{ fontSize: "0.9rem", color: "#00F2FF", opacity: 0.75 }}>
                    {authUser.email}
                  </p>
                </div>

                <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", width: "100%" }} />

                <p className="font-mono" style={{ fontSize: "1.15rem" }}>
                  <span style={{ color: "#FF00EE", fontWeight: "bold" }}>{authUser.messagesNum}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", marginLeft: "10px" }}>MESSAGES</span>
                </p>
              </div>

              {/* Bio box */}
              <div
                className="rounded-2xl p-5"
                style={{
                  border: "1px solid rgba(0,255,123,0.2)",
                  boxShadow: "0 0 12px rgba(0,255,123,0.04)",
                }}
              >
                <BioSection />
              </div>

              {/* Logout pushed to bottom */}
              <div className="mt-auto pt-2">
                <LogoutBtn fullWidth />
              </div>
            </div>

            {/* ── RIGHT: Groups ── */}
            <div className="flex flex-col p-8 flex-1 gap-5">
              <div
                className="flex flex-col gap-4 rounded-2xl p-6 h-full"
                style={{
                  border: "1px solid rgba(255,0,238,0.2)",
                  boxShadow: "0 0 12px rgba(255,0,238,0.04)",
                }}
              >
                <h3
                  className="pixel-font pb-3"
                  style={{ fontSize: "1.35rem", color: "#FF00EE", borderBottom: "1px solid rgba(255,0,238,0.25)" }}
                >
                  Your Groups
                </h3>

                {myGroups.length === 0 && !groupLoading && (
                  <Link to="/addGroup">
                    <p className="font-mono" style={{ fontSize: "1rem", color: "#00FF7B" }}>
                      CREATE YOUR FIRST GROUP →
                    </p>
                  </Link>
                )}

                {groupLoading ? (
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mt-8" />
                ) : (
                  <div className="flex flex-col gap-3">
                    {myGroups?.map((group) => (
                      <GroupCard key={group._id} group={group} compact={false} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════
            MOBILE LAYOUT  (< lg)
        ════════════════════════════════════ */}
        <div className="lg:hidden w-full max-w-md flex flex-col gap-6">

          {/* Profile card */}
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(0,242,255,0.3)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.6), 0 0 12px rgba(0,242,255,0.07)",
            }}
          >
            <div style={{ height: "3px", background: "linear-gradient(90deg, #00FF7B, #00F2FF, #FF00EE, #EAFF00)" }} />
            <div className="flex flex-col gap-5 p-6 items-center">
              <Avatar size="112px" />

              <div className="flex flex-col gap-4 w-full text-center">
                <div>
                  <h2 className="pixel-font font-bold" style={{ fontSize: "1.4rem", color: "#fff", lineHeight: 1.2 }}>
                    {authUser.username}
                  </h2>
                  <p className="font-mono mt-1" style={{ fontSize: "0.85rem", color: "#00F2FF", opacity: 0.8 }}>
                    {authUser.email}
                  </p>
                </div>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />
                <p className="font-mono" style={{ fontSize: "1rem" }}>
                  <span style={{ color: "#FF00EE", fontWeight: "bold" }}>{authUser.messagesNum}</span>
                  <span style={{ color: "rgba(255,255,255,0.45)", marginLeft: "10px" }}>MESSAGES</span>
                </p>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />
                <BioSection />
              </div>
            </div>
          </div>

          {/* Groups */}
          <div className="flex flex-col gap-3">
            <h3
              className="pixel-font text-center pb-3"
              style={{ fontSize: "1.15rem", color: "#FF00EE", borderBottom: "1px solid rgba(255,0,238,0.3)" }}
            >
              Your Groups
            </h3>

            {myGroups.length === 0 && !groupLoading && (
              <Link to="/addGroup">
                <p className="text-center font-mono" style={{ fontSize: "0.9rem", color: "#00FF7B" }}>
                  CREATE YOUR FIRST GROUP →
                </p>
              </Link>
            )}

            {groupLoading ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              myGroups?.map((group) => (
                <GroupCard key={group._id} group={group} compact={true} />
              ))
            )}
          </div>

          {/* Logout */}
          <div className="flex justify-center">
            <LogoutBtn />
          </div>
        </div>
      </div>

      {/* ── Picture Picker Modal ── */}
      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setPickerOpen(false); }}
        >
          <div
            className="relative flex flex-col gap-5 w-full max-w-sm rounded-2xl overflow-hidden"
            style={{
              background: "#000",
              border: "1px solid rgba(0,242,255,0.3)",
              boxShadow: "0 0 40px rgba(0,242,255,0.1)",
            }}
          >
            <div style={{ height: "3px", background: "linear-gradient(90deg, #00FF7B, #00F2FF, #FF00EE, #EAFF00)" }} />
            <div className="flex flex-col gap-5 px-6 pb-6">
              <h3 className="pixel-font text-center" style={{ fontSize: "1rem", color: "#00F2FF" }}>
                CHOOSE PROFILE PICTURE
              </h3>
              {picturesLoading ? (
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {availablePics.map((pic) => {
                    const picName = pic.replace(".png", "");
                    const isSelected = selectedPic === picName;
                    return (
                      <div
                        key={pic}
                        className="cursor-pointer transition-all duration-150"
                        onClick={() => setSelectedPic(picName)}
                        style={{
                          padding: "2px",
                          borderRadius: "50%",
                          background: isSelected ? "linear-gradient(135deg, #00FF7B, #FF00EE)" : "rgba(255,255,255,0.05)",
                          boxShadow: isSelected ? "0 0 14px #00FF7B66" : "none",
                        }}
                      >
                        <img
                          src={`/profiles/${pic}`}
                          alt={pic}
                          className="rounded-full block w-full"
                          style={{ background: "#111", aspectRatio: "1" }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setPickerOpen(false)}
                  className="flex-1 py-2.5 rounded-full font-mono text-sm cursor-pointer transition-all duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.4)" }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handlePicSave}
                  disabled={updateLoading}
                  className="flex-1 py-2.5 rounded-full font-mono font-bold text-sm cursor-pointer transition-all duration-200"
                  style={{ background: "#00FF7B", color: "#000", border: "1px solid #00FF7B", boxShadow: "0 0 14px #00FF7B66" }}
                >
                  {updateLoading ? "..." : "SAVE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
