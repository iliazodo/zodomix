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

  // Bio state
  const [bioEditing, setBioEditing] = useState(false);
  const [bioValue, setBioValue] = useState(authUser.bio || "");

  // Picture picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [availablePics, setAvailablePics] = useState([]);
  const [selectedPic, setSelectedPic] = useState(authUser.profilePic);

  // Hover states
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

  // Bio save
  const handleBioSave = async () => {
    await updateProfile({ bio: bioValue });
    setBioEditing(false);
  };

  // Open picture picker — fetch list on first open
  const handleOpenPicker = async () => {
    if (availablePics.length === 0) {
      const pics = await getProfilePictures();
      // Sort numerically (1.png, 2.png, ...)
      pics.sort((a, b) => parseInt(a) - parseInt(b));
      setAvailablePics(pics);
    }
    setSelectedPic(authUser.profilePic);
    setPickerOpen(true);
  };

  // Save new profile picture
  const handlePicSave = async () => {
    await updateProfile({ profilePic: selectedPic });
    setPickerOpen(false);
  };

  useEffect(() => {
    gettingMyGroups();
  }, []);

  return (
    <>
      <Nav />
      <div className="bg-black min-h-screen pt-32 pb-20 flex flex-col gap-10 items-center w-full">

        {/* Profile card */}
        <div
          className="relative flex flex-col items-center gap-6 w-[calc(100%-32px)] max-w-md rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(0,242,255,0.3)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.6), 0 0 12px rgba(0,242,255,0.07)",
          }}
        >
          {/* Top gradient bar */}
          <div style={{ height: "3px", width: "100%", background: "linear-gradient(90deg, #00FF7B, #00F2FF, #FF00EE, #EAFF00)" }} />

          <div className="flex flex-col items-center gap-5 px-8 pb-8 w-full">

            {/* Clickable avatar */}
            <div className="relative group cursor-pointer mt-2" onClick={handleOpenPicker}>
              <div
                style={{
                  padding: "3px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00FF7B, #FF00EE)",
                }}
              >
                <img
                  className="rounded-full block"
                  src={`./profiles/${authUser.profilePic}.png`}
                  alt="profile picture"
                  style={{ width: "110px", height: "110px", background: "#000" }}
                />
              </div>
              {/* Hover overlay */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: "rgba(0,0,0,0.6)" }}
              >
                <span className="font-mono text-xs text-center px-2" style={{ color: "#00F2FF" }}>
                  CHANGE
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-3 w-full text-center">
              <h2
                className="pixel-font font-bold"
                style={{ fontSize: "1.4rem", color: "#fff" }}
              >
                {authUser.username}
              </h2>
              <p className="font-mono text-sm" style={{ color: "#00F2FF", opacity: 0.8 }}>
                {authUser.email}
              </p>

              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

              <p className="font-mono text-lg">
                <span style={{ color: "#FF00EE", fontWeight: "bold" }}>{authUser.messagesNum}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", marginLeft: "8px" }}>MESSAGES</span>
              </p>
            </div>

            {/* Bio section */}
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs" style={{ color: "#EAFF00", opacity: 0.8 }}>
                  BIO
                </span>
                {!bioEditing && (
                  <button
                    onClick={() => setBioEditing(true)}
                    className="font-mono text-xs cursor-pointer transition-all duration-200"
                    style={{ color: "#00F2FF", border: "1px solid #00F2FF", borderRadius: "999px", padding: "2px 10px" }}
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
                    className="w-full bg-transparent font-mono text-sm resize-none outline-none rounded-xl p-3"
                    style={{
                      border: "1px solid rgba(0,242,255,0.4)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                    placeholder="Write something about yourself..."
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setBioEditing(false); setBioValue(authUser.bio || ""); }}
                      className="font-mono text-xs cursor-pointer rounded-full px-4 py-1 transition-all duration-200"
                      style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.4)" }}
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={handleBioSave}
                      disabled={updateLoading}
                      className="font-mono text-xs cursor-pointer rounded-full px-4 py-1 transition-all duration-200"
                      style={{ background: "#00FF7B", color: "#000", border: "1px solid #00FF7B", fontWeight: "bold" }}
                    >
                      {updateLoading ? "..." : "SAVE"}
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className="font-mono text-sm rounded-xl p-3 min-h-[52px]"
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: authUser.bio ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.2)",
                    fontStyle: authUser.bio ? "normal" : "italic",
                  }}
                >
                  {authUser.bio || "No bio yet..."}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Your Groups */}
        <div className="w-full max-w-lg flex flex-col gap-4 px-4">
          <h3
            className="pixel-font text-center pb-3"
            style={{ fontSize: "1.3rem", color: "#FF00EE", borderBottom: "1px solid rgba(255,0,238,0.3)" }}
          >
            Your Groups
          </h3>

          {myGroups.length === 0 && !groupLoading && (
            <Link to="/addGroup">
              <p className="text-center text-lg font-mono" style={{ color: "#00FF7B" }}>
                CREATE YOUR FIRST GROUP →
              </p>
            </Link>
          )}

          {groupLoading ? (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            myGroups?.map((group) => (
              <div
                key={group._id}
                className="relative flex flex-row items-center gap-4 rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(0,242,255,0.3)",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.6), 0 0 12px rgba(0,242,255,0.07)",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #00FF7B, #00F2FF, #FF00EE, #EAFF00)" }} />
                <div className="flex flex-row items-center gap-4 p-4 pt-5 w-full">
                  <div style={{ padding: "2px", borderRadius: "50%", background: "linear-gradient(135deg, #00FF7B, #FF00EE)", flexShrink: 0 }}>
                    <img
                      src={`/groups/group-${1}.png`}
                      className="rounded-full block"
                      alt={group.name}
                      style={{ width: "56px", height: "56px", background: "#000" }}
                    />
                  </div>
                  <p className="pixel-font font-bold flex-1 truncate" style={{ fontSize: "1rem" }}>
                    {group.name}
                  </p>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link to={`/edit/${group._id}`}>
                      <button
                        onClick={handleEdit}
                        onMouseEnter={() => setHoveredEdit(group._id)}
                        onMouseLeave={() => setHoveredEdit(null)}
                        className="rounded-full py-1.5 px-4 font-mono font-bold text-sm transition-all duration-200 cursor-pointer"
                        style={
                          hoveredEdit === group._id
                            ? { background: "#00FF7B", color: "#000", border: "1px solid #00FF7B", boxShadow: "0 0 12px #00FF7B88" }
                            : { background: "transparent", color: "#00FF7B", border: "1px solid #00FF7B" }
                        }
                      >
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(group._id)}
                      onMouseEnter={() => setHoveredDelete(group._id)}
                      onMouseLeave={() => setHoveredDelete(null)}
                      className="rounded-full py-1.5 px-4 font-mono font-bold text-sm transition-all duration-200 cursor-pointer"
                      style={
                        hoveredDelete === group._id
                          ? { background: "#FF00EE", color: "#000", border: "1px solid #FF00EE", boxShadow: "0 0 12px #FF00EE88" }
                          : { background: "transparent", color: "#FF00EE", border: "1px solid #FF00EE" }
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          onMouseEnter={() => setLogoutHovered(true)}
          onMouseLeave={() => setLogoutHovered(false)}
          disabled={loading}
          className="rounded-full py-4 px-12 font-mono font-bold text-xl transition-all duration-200 cursor-pointer w-[calc(100%-32px)] max-w-xs"
          style={
            loading
              ? { background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.3)" }
              : logoutHovered
              ? { background: "#EAFF00", color: "#000", border: "1px solid #EAFF00", boxShadow: "0 0 18px #EAFF0088" }
              : { background: "transparent", border: "1px solid #EAFF00", color: "#EAFF00" }
          }
        >
          {loading ? (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : "LOG OUT"}
        </button>
      </div>

      {/* Picture Picker Modal */}
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
            {/* Top gradient bar */}
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
                          background: isSelected
                            ? "linear-gradient(135deg, #00FF7B, #FF00EE)"
                            : "transparent",
                          boxShadow: isSelected ? "0 0 12px #00FF7B66" : "none",
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

              {/* Modal buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setPickerOpen(false)}
                  className="flex-1 py-2 rounded-full font-mono text-sm cursor-pointer transition-all duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.4)" }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handlePicSave}
                  disabled={updateLoading}
                  className="flex-1 py-2 rounded-full font-mono font-bold text-sm cursor-pointer transition-all duration-200"
                  style={{
                    background: "#00FF7B",
                    color: "#000",
                    border: "1px solid #00FF7B",
                    boxShadow: "0 0 14px #00FF7B66",
                  }}
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
