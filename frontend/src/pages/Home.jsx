import React from "react";

import Header from "../components/Nav.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import Text from "../components/homeComponents.jsx/Text.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  const { authUser } = useAuthContext();

  return (
    <>
      <Header />
      <div className="overflow-auto h-screen grid grid-cols-1 md:grid-cols-2 py-32 gap-20">
        {/* Home content */}

        <Text title={`Hey ${authUser ? authUser.username : "Guest"},`}>
          ZODOMIX is a ANONYMOUS real-time groupchat.
          <br />
          Your Human Number is{" "}
          {authUser ? (
            authUser.humanNum
          ) : (
            <Link to="/signup" style={{ color: "#FF00EE" }}>
              -signup required-
            </Link>
          )}
          <br />
          Create your own free group and chat with strangers or create a
          password and make it private, use for yourself or with friends.
          <br />
          {!authUser && (
            <Link
              to="/signup"
              style={{ color: "#FF00EE" }}
              className="flex justify-center pt-3 "
            >
              <span className="text-3xl border-2 border-b-fuchsia-500 border-l-fuchsia-500  rounded-full px-5 py-2 hover transform duration-200 ease-in hover:bg-fuchsia-500 hover:text-white hover:border-r-fuchsia-300 hover:border-t-fuchsia-300 hover:border-l-white hover:border-b-white">
                Get Started
              </span>
            </Link>
          )}
          {authUser && (
            <Link
              to="/addGroup"
              className="flex justify-center pt-3 text-green-500 "
            >
              <span className="text-3xl border-2 border-b-green-500 border-l-green-500  rounded-full px-5 py-2 hover transform duration-200 ease-in hover:bg-green-500 hover:text-white hover:border-r-green-300 hover:border-t-green-300 hover:border-l-white hover:border-b-white">
                Create a Group
              </span>
            </Link>
          )}
        </Text>

        <Text title={"News"}>
          Now you can have your own chatroom, just signup and go to{" "}
          <Link style={{ color: "#FF00EE" }} to={"/explore"}>
            explore
          </Link>
          .<br />
          You can promote your business in ADS group for FREE.
          <br />
          Now you can chat grouply with ai{" "}
          <Link style={{ color: "#FF00EE" }} to={"/robot"}>
            HERE
          </Link>
          .
        </Text>

        <Text title={"website"}>
          If there was any error or bug try{" "}
          <Link style={{ color: "#FF00EE" }} to={"/profile"}>
            Logout
          </Link>{" "}
          and{" "}
          <Link style={{ color: "#FF00EE" }} to={"/login"}>
            Login
          </Link>{" "}
          again.
          <br />
          For having permanent username and profile picture SIGN UP!
          <br />
          For verifying your email check your spam folder too!
        </Text>

        <Text title={"About"}>
          Creator: Zodo
          <br />
          Email: contact@zodomix.com
          <br />
          Copyright &copy; 2025 zodomix
        </Text>
      </div>
    </>
  );
};

export default Home;
