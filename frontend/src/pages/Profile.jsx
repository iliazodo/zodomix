import React from "react";

import Nav from "../components/Nav.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import useLogout from "../hooks/useLogout.js";

const Profile = () => {
  const { authUser } = useAuthContext();
  const { loading, logout } = useLogout();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <Nav />
      <div className="flex flex-col gap-5 justify-center items-center w-full pt-52">
        <div className="w-full flex flex-col justify-center items-center gap-10">
          <img
            className="border-4 rounded-full w-1/3 max-w-80 m-auto -z-50"
            src={`./profiles/${authUser.profilePic}.png`}
            alt="profile picture"
          />
          <div className="flex flex-col gap-5">
            <h3>USERNAME: {authUser.username}</h3>
            <h3>EMAIL: {authUser.email}</h3>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className={`bg-transparent border-2 rounded-full p-5 text-2xl w-1/2 transition duration-300 ease-out m-auto mt-20
             xl:w-1/4 cursor-pointer ${
               !loading &&
               "hover:bg-white hover:text-black active:bg-black active:text-white"
             } `}
        >
          {loading ? (
            <div className=" w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin m-auto" />
          ) : (
            "LOG OUT"
          )}
        </button>
      </div>
    </>
  );
};

export default Profile;
