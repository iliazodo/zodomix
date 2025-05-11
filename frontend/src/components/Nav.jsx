import React, { useEffect, useState } from "react";

import {useAuthContext} from "../context/AuthContext.jsx"
import {Link, useNavigate} from "react-router-dom";

const Nav = () => {

  const navigate = useNavigate();

  const [currGroup , setCurrGroup] = useState('All');

  useEffect(() => {
    setCurrGroup(JSON.parse(localStorage.getItem("zdm-group")) || "ALL");
  } ,[navigate] )

  const {authUser} = useAuthContext();

  return (
    <nav className="flex flex-row items-center md:justify-between gap-5 w-full fixed bg-black z-50">
      {/*logo*/}
      <Link to="/" className="md:w-1/4">
        <img src="zodomixLogo.png" alt="Zodomix Logo" className="w-[calc(100%-1rem)]" />
      </Link>
      {/*header navbar*/}
      <div className="hidden md:block md:w-60 xl:w-80 fixed top-14 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ul className=" flex flex-row justify-between w-60 xl:w-72 border-white border-2 rounded-full px-2 m-auto">
          <li className="md:w-16 xl:w-20 md:p-3">
            <Link to="/">
              <img src="/public/home.png" alt="Home" className="hover:scale-125 transition duration-100 ease-in" />
            </Link>
          </li>
          <li className="md:w-16 xl:w-20 md:p-3">
            <Link to={`/chatZone/:${currGroup}`}>
              <img src="/public/chat.png" alt="Chat" className="hover:scale-125 transition duration-100 ease-in" />
            </Link>
          </li>
          <li className="md:w-16 xl:w-20 md:p-3">
            <Link to="/explore">
              <img src="/public/explore.png" alt="Explore" className="hover:scale-125 transition duration-100 ease-in" />
            </Link>
          </li>
        </ul>
      </div>
      {/*profile image*/}
      <div className="md:p-3 md:w-28 w-full">
      <Link to="/profile" className="w-2">
        <img src={`/public/profiles/${authUser.profilePic}.png`} alt="profile" className="scale-150 md:scale-100 border-none rounded-full" />
      </Link>
      </div>
      {/*footer navbar*/}
      <div className="md:hidden fixed bottom-0 bg-black w-full py-2">
        <ul className=" flex flex-row justify-between w-ful px-2">
          <li className="w-16">
            <Link to="/">
              <img src="/public/home.png" alt="Home" className="hover:scale-125 transition duration-100 ease-in" />
            </Link>
          </li>
          <li className="w-16">
            <Link to={`/chatZone/:${currGroup}`}>
              <img src="/public/chat.png" alt="Chat" className="hover:scale-125 transition duration-100 ease-in" />
            </Link>
          </li>
          <li className="w-16">
            <Link to="/explore">
              <img src="/public/explore.png" alt="Explore" className="hover:scale-125 transition duration-100 ease-in" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
