import React, { useEffect, useState } from "react";

import Nav from "../components/Nav.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import useLogout from "../hooks/useLogout.js";
import useGetMyGroups from "../hooks/useGetMyGroups.js";
import useDeleteGroup from "../hooks/useDeleteGroup.js";
import { Link } from "react-router-dom";

const Profile = () => {
  const { authUser } = useAuthContext();
  const { loading, logout } = useLogout();
  const { groupLoading, getMyGroups } = useGetMyGroups();
  const { deleteLoading, deleteGroup } = useDeleteGroup();

  const [myGroups, setMyGroups] = useState([]);

  const handleLogout = async () => {
    await logout();
  };

  const handleEdit = () => {};

  const handleDelete = async (groupId) => {
    if (window.confirm("ARE YOU SURE?")) {
      await deleteGroup(groupId);
      gettingMyGroups();
    }
  };

  const gettingMyGroups = async () => {
    const data = await getMyGroups();
    setMyGroups(data);
  };

  useEffect(() => {
    gettingMyGroups();
  }, []);

  return (
    <>
      <Nav />
      <div className="py-40 flex flex-col gap-5 justify-center items-center w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-full flex flex-col justify-center items-center gap-10">
          <img
            className="mt-52 border-4 rounded-full w-1/3 lg:w-1/6 max-w-80 m-auto -z-50"
            src={`./profiles/${authUser.profilePic}.png`}
            alt="profile picture"
          />
          <div className="flex flex-col gap-5 text-2xl">
            <h3>USERNAME: {authUser.username}</h3>
            <h3>EMAIL: {authUser.email}</h3>
          </div>
          <div className="w-full">
            <p className="text-4xl text-center w-1/2 m-auto mb-10 text-fuchsia-500 border-2 border-b-fuchsia-500 border-transparent pb-2">
              Your Groups
            </p>
            {myGroups.length == 0 && (
              <Link to={"/addGroup"}>
                <p className="text-center text-2xl text-fuchsia-500">
                  CREATE YOUR FIRST GROUP ⇨
                </p>
              </Link>
            )}
            {groupLoading ? (
              <div className=" w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin m-auto" />
            ) : (
              myGroups.map((group) => (
                <div
                  key={group._id}
                  className="flex flex-row relative m-auto border-2 border-white rounded-3xl w-[calc(100%-50px)] lg:w-1/2 xl:w-1/3 h-32"
                >
                  <img
                    src={`/groups/group-${1}.png`}
                    className="border-2 border-white rounded-full w-28 h-28 my-auto ml-3"
                    alt={group.name}
                  />
                  <div className="flex flex-col">
                    <p className="text-xl md:text-3xl text-center absolute left-1/3 font-bold">
                      {group.name}
                    </p>
                    <div className="flex flex-row gap-4 py-5 pl-32 absolute bottom-1 right-5">
                      <Link to={`/edit/${group._id}`}>
                      <button
                        onClick={handleEdit}
                        className="border-2 rounded-3xl py-2 px-5 text-base bg-green-500 font-bold"
                      >
                        Edit
                      </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(group._id)}
                        className="border-2 rounded-3xl py-2 px-5 text-base bg-red-500 font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className={`bg-transparent border-2 rounded-full p-5 text-2xl w-1/2 transition duration-300 ease-out m-auto mt-10
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
