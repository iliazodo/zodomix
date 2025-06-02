import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import useAddGroup from "../hooks/useAddGroup.js";
import { useNavigate } from "react-router-dom";

const AddGroup = () => {
  const [inputs, setInputs] = useState({
    name: "",
    isPublic: true,
    password: "",
    isAnonymous: true,
    description: "",
  });

  const navigate = useNavigate();

  const { loading, addGroup } = useAddGroup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await addGroup(inputs);
    if (res) {
      localStorage.setItem("zdm-group", JSON.stringify(inputs.name));
      navigate(`/chatZone/${inputs.name}`);
    }
  };

  useEffect(() => {
    const nameWithDash = inputs.name.replace(/\s+/g, "-");
    if (nameWithDash !== inputs.name) {
      setInputs((prev) => ({ ...prev, name: nameWithDash }));
    }
  }, [inputs.name]);

  return (
    <>
      <Nav />
      <div className="overflow-auto flex flex-col items-center md:grid-cols-2 xl:grid-cols-3 sm:pt-32 py-28">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-10 h-5/6 w-[calc(100%-40px)] p-3 border-2 border-white rounded-3xl"
        >
          <h1 className="pixel-font text-xl text-center border-b-2 w-3/4 m-auto mb-6 pb-3">
            Add new Group
          </h1>
          <div className="w-5/6 flex flex-col  space-y-3 mx-auto">
            <label className="text-2xl showUpAnimate">Group Name</label>
            <input
              type="text"
              maxLength={30}
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              className="bg-transparent rounded-full py-3 px-8 text-2xl font-mono border-2 outline-none"
            />
          </div>
          <div className="mx-auto flex flex-row justify-center gap-20">
            <label className="text-2xl justify-center">
              <input
                type="radio"
                className="accent-fuchsia-500 h-9 w-9"
                name="isPublic"
                defaultChecked
                onChange={(e) => setInputs({ ...inputs, isPublic: true })}
              />
              Public
            </label>
            <label className="text-2xl">
              <input
                type="radio"
                className="accent-fuchsia-500 h-9 w-9"
                name="isPublic"
                onChange={(e) => setInputs({ ...inputs, isPublic: false })}
              />
              Private
            </label>
          </div>

          {!inputs.isPublic && (
            <div className="w-5/6 flex flex-col  space-y-3 mx-auto">
              <label className="text-2xl showUpAnimate">Password</label>
              <input
                type="password"
                maxLength={25}
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
                className="bg-transparent rounded-full py-3 px-8 text-2xl font-mono border-2 outline-none"
              />
            </div>
          )}

          <div className="mx-auto flex flex-row justify-center gap-5">
            <label className="text-2xl justify-center">
              <input
                type="radio"
                className="accent-fuchsia-500 h-9 w-9 -pt-"
                name="isAnonymous"
                defaultChecked
                onChange={(e) => setInputs({ ...inputs, isAnonymous: true })}
              />
              Anonymous
            </label>
            <label className="text-2xl">
              <input
                type="radio"
                className="accent-fuchsia-500 h-9 w-9"
                name="isAnonymous"
                onChange={(e) => setInputs({ ...inputs, isAnonymous: false })}
              />
              See Usernames
            </label>
          </div>

          <div className="w-5/6 flex flex-col  space-y-3 mx-auto">
            <label className="text-2xl showUpAnimate">Description</label>
            <textarea
              type="text"
              maxLength={200}
              className="bg-transparent rounded-3xl py-3 px-8 text-2xl font-mono border-2 outline-none"
              value={inputs.description}
              onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className={`mb-8 bg-transparent border-2 rounded-full p-5 text-2xl w-1/2 transition duration-300 ease-out m-auto ${
              !loading &&
              "hover:bg-white hover:text-black active:bg-black active:text-white"
            }  xl:w-1/4 cursor-pointer`}
            disabled={loading}
          >
            {loading ? (
              <div className=" w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin m-auto" />
            ) : (
              "ENTER"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddGroup;
