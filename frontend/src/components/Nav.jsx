import React, { useEffect, useState } from "react";

import { useAuthContext } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();

  const [currGroup, setCurrGroup] = useState("All");

  useEffect(() => {
    setCurrGroup(JSON.parse(localStorage.getItem("zdm-group")) || "ALL");
  }, [navigate]);

  const { authUser } = useAuthContext();

  return (
    <nav className="flex flex-row items-center justify-between w-full fixed top-0 bg-black z-50">
      {/*logo*/}
      <Link to="/" className="md:w-1/4">
        <img
          src="/zodomixLogo.png"
          alt="Zodomix Logo"
          className="w-96 h-20 object-contain ml-1 md:ml-5"
        />
      </Link>
      {/*header navbar*/}
      <div className="hidden md:block md:w-60 xl:w-80 fixed top-14 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ul className=" flex flex-row justify-between w-60 xl:w-72 border-white border-2 rounded-full px-2 m-auto">
          <li className="md:w-16 xl:w-20 md:p-3">
            <Link to="/">
              <img
                src="/home.png"
                alt="Home"
                className="scale-110 hover:scale-150 transition duration-100 ease-in"
              />
            </Link>
          </li>
          <li className="md:w-16 xl:w-20 md:p-3">
            <Link to={`/chatZone/${currGroup}`}>
              <img
                src="/chat.png"
                alt="Chat"
                className="hover:scale-125 transition duration-100 ease-in"
              />
            </Link>
          </li>
          <li className="md:w-16 xl:w-20 md:p-3">
            <Link to="/explore">
              <img
                src="/explore.png"
                alt="Explore"
                className="hover:scale-125 transition duration-100 ease-in"
              />
            </Link>
          </li>
          <li className="md:w-16 xl:w-20 md:p-3">
            <Link to="/robot">
              <img
                src="/robot.png"
                alt="Robot"
                className="scale-110 hover:scale-150 transition duration-100 ease-in"
              />
            </Link>
          </li>
        </ul>
      </div>
      {/*profile image*/}
      <div className="md:pt-6 md:w-28 md:h-28 mr-4">
        <Link to="/profile">
          <img
            src={`/profiles/${
              authUser ? authUser.profilePic : "defaultPic"
            }.png`}
            alt="profile"
            className="border-2 rounded-full w-16 h-16"
          />
        </Link>
      </div>
      {/*footer navbar*/}
      <div className="md:hidden border-t border-t-gray-900 fixed bottom-0 bg-black w-full py-2">
        <ul className=" flex flex-row justify-between w-ful px-2">
          <li className="w-10">
            <Link to="/">
              <img
                src="/home.png"
                alt="Home"
                className="scale-110 transition duration-100 ease-in"
              />
            </Link>
          </li>
          <li className="w-10">
            <Link to={`/chatZone/${currGroup}`}>
              <img
                src="/chat.png"
                alt="Chat"
                className="transition duration-100 ease-in"
              />
            </Link>
          </li>
          <li className="w-10">
            <Link to="/explore">
              <img
                src="/explore.png"
                alt="Explore"
                className="transition duration-100 ease-in"
              />
            </Link>
          </li>
          <li className="w-10">
            <Link to="/robot">
              <img
                src="/robot.png"
                alt="Robot"
                className="scale-110 transition duration-100 ease-in"
              />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
