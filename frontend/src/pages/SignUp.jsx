import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../hooks/auth/useSignup.js";
import toast from "react-hot-toast";

const Login = () => {
  const [inputs, setInputs] = useState({
    website: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);

  const { loading, signUp } = useSignup();

  const [serverMessage, setServerMessage] = useState(null);

  useEffect(() => {
    if (inputs.password !== inputs.confirmPassword) {
      setError("PASSWORDS DON'T MATCH");
    } else {
      setError(null);
    }
  }, [inputs.confirmPassword, inputs.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signUp(inputs);

    setInputs({
      website: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    if (res.ok) {
      setServerMessage(
        "CHECK YOUR SPAM FOLDER. \n WE SENT YOU AN EMAIL, PLEASE CLICK ON LINK TO VERIFY YOUR EMAIL."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 h-full w-full bg-black">
      <Link to="/" className="w-full">
        <img
          src="zodomixLogo.png"
          alt="zodomix logo"
          className="lg:w-2/3 md:w-3/4 m-auto mt-10"
        />
      </Link>

      {/* verify message */}
      {serverMessage && (
        <div className="w-full h-auto text-green-300 text-center md:text-xl py-5">
          CHECK YOUR SPAM FOLDER. WE SENT YOU AN EMAIL, PLEASE CLICK ON THE LINK
          TO VERIFY YOUR EMAIL. IF YOU DID'T RECEIVE ANY EMAIL DO THE SIGNUP
          AGAIN.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col md:grid-cols-2 xl:w-2/3 items-center justify-center gap-3 z-10"
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 md:mt-[calc(10%)] items-center justify-center gap-3 z-10">
          {/* HoneyPot */}
          <div className="absolute top-0 w-1 h-1 hidden">
            <label htmlFor="website">Leave this field empty</label>
            <input
              type="text"
              maxLength={25}
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
            <label className="text-2xl showUpAnimate">USERNAME</label>
            <input
              type="text"
              maxLength={25}
              className="bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </div>
          <div className="w-5/6 flex flex-col  space-y-3 mx-auto">
            <label className="text-2xl showUpAnimate">EMAIL</label>
            <input
              type="email"
              className="bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </div>
          <div className="w-5/6 flex flex-col  space-y-3 mx-auto">
            <label className="text-2xl showUpAnimate">PASSWORD</label>
            <input
              type="password"
              className="bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </div>
          <div className="w-5/6 flex flex-col  space-y-3 mx-auto">
            <label className="text-2xl showUpAnimate">CONFIRM PASSWORD</label>
            <input
              type="password"
              className="bg-transparent rounded-full p-5 text-2xl font-mono border-2 outline-none"
              value={inputs.confirmPassword}
              onChange={(e) =>
                setInputs({ ...inputs, confirmPassword: e.target.value })
              }
            />
          </div>
        </div>
        <button
          type="submit"
          className={`  bg-transparent border-2 rounded-full p-5 text-2xl w-1/2 transition duration-300 ease-out m-auto mt-14  ${
            !loading &&
            !error &&
            "hover:bg-white hover:text-black active:bg-black active:text-white"
          } ${error && "cursor-not-allowed"}  xl:w-1/4 cursor-pointer`}
          disabled={loading || error}
        >
          {loading ? (
            <div className=" w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin m-auto" />
          ) : error ? (
            error
          ) : (
            "ENTER"
          )}
        </button>
      </form>
      <div className="flex flex-row gap-5">
        <Link
          to="/"
          className="md:absolute md:mb-0 mb-10 bottom-5 left-5 text-3xl cursor-pointer transform duration-100 ease-in hover:font-bold xl:text-5xl sm:text-4xl"
        >
          ⇦ HOME
        </Link>
        <p className="text-2xl md:hidden">|</p>
        <Link
          to="/login"
          className=" md:absolute md:mb-0 mb-10 bottom-5 right-5 text-3xl cursor-pointer transform duration-100 ease-in hover:font-bold xl:text-5xl sm:text-4xl"
        >
          LOGIN ⇨
        </Link>
      </div>
    </div>
  );
};

export default Login;
