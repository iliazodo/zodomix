import React, { useState } from "react";
import { Link } from "react-router-dom";

import useLogin from "../hooks/useLogin.js";

const Login = () => {
  const [inputs, setInputs] = useState({
    website: "",
    username: "",
    password: "",
  });

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(inputs);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 h-full w-full bg-black">
      <Link to="/">
      <img
        src="zodomixLogo.png"
        alt="zodomix logo"
        className="lg:w-2/3 md:w-3/4  mt-10"
      />
      </Link>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col md:grid-cols-2 xl:w-2/3 items-center justify-center gap-3 z-10"
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 md:mt-[calc(20%)]  items-center justify-center gap-3 mt-16 z-10">
          {/* HoneyPot */}
          <div className="absolute top-0 w-1 h-1 hidden">
            <label htmlFor="website">Leave this field empty</label>
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex="-1"
              value={inputs.website}
              onChange={(e) =>
                setInputs({ ...inputs, website: e.target.value })
              }
            />
          </div>

          <div className="w-5/6 flex flex-col  space-y-3 mx-auto">
            <label className="text-2xl">USERNAME</label>
            <input
              type="text"
              className="bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </div>
          <div className="w-5/6 flex flex-col  space-y-3 mx-auto">
            <label className="text-2xl">PASSWORD</label>
            <input
              type="password"
              className="bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </div>
        </div>
        <button
          type="submit"
          className={` bg-transparent border-2 rounded-full p-5 text-2xl w-1/2 transition duration-300 ease-out m-auto mt-14 ${
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
      <Link
        to="/signUp"
        className="md:absolute  bottom-5 right-5 text-3xl cursor-pointer transform duration-100 ease-in hover:font-bold xl:text-5xl sm:text-4xl"
      >
        SIGIN UP ⇨
      </Link>
      <Link
        to="/signUp"
        className="md:absolute bottom-5 left-5 text-3xl cursor-pointer transform duration-100 ease-in hover:font-bold xl:text-5xl sm:text-4xl"
      >
        ⇦ HOME
      </Link>
    </div>
  );
};

export default Login;
