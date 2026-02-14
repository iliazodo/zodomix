import React from "react";
import Header from "../components/Nav.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  const { authUser } = useAuthContext();

  return (
    <>
      <Header />
      <div className="mt-[80px] mb-[80px] md:mb-0 text-white overflow-hidden flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-2 md:py-3 lg:py-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center md:flex md:flex-row md:items-center md:justify-between mb-2">
              <p className="text-2xl text-white sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent mb-2 md:mb-4">
                {authUser ? (
                  <>
                    Hello
                    <span className="" style={{ color: "#EAFF00" }}>
                      {" "}
                      {authUser.username}
                    </span>
                  </>
                ) : (
                  "Hello Stranger"
                )}
              </p>
              <h1 className="text-sm sm:text-base md:text-lg font-semibold mb-2">
                Welcome to{" "}
                <span className="font-bold" style={{ color: "#FF00EE" }}>
                  ZODOMIX
                </span>{" "}
                — Anonymous Real-Time Chat
              </h1>
            </div>

            {/* Main Info Card */}
            <div
              className="border rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-2xl mb-4 md:mb-6 lg:mb-8"
              style={{
                background: "rgba(0, 0, 0, 0.6)",
                borderColor: "#FF00EE",
                borderWidth: "2px",
              }}
            >
              <div className="space-y-2 md:space-y-3 lg:space-y-4">
                <div>
                  <p
                    className="text-sm sm:text-base md:text-lg font-semibold mb-1 md:mb-2"
                    style={{ color: "#FF00EE" }}
                  >
                    Your Human Number
                  </p>
                  <p
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold"
                    style={{ color: "#FF00EE" }}
                  >
                    {authUser ? (
                      authUser.humanNum
                    ) : (
                      <Link
                        to="/signup"
                        style={{ color: "#FF00EE" }}
                        className="hover:opacity-80 transition"
                      >
                        -signup required-
                      </Link>
                    )}
                  </p>
                </div>

                <div
                  style={{ borderColor: "#FF00EE", borderTopWidth: "1px" }}
                  className="pt-2 md:pt-3"
                >
                  <p className="text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                    Create your own free group and chat with strangers or make
                    it private — for yourself or friends.
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-2 md:pt-3">
                  {!authUser ? (
                    <Link
                      to="/signup"
                      className="inline-block text-white font-bold py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 text-xs sm:text-sm md:text-base rounded-lg transition transform hover:scale-105 duration-200 shadow-lg"
                      style={{ backgroundColor: "#FF00EE" }}
                    >
                      Get Started Now
                    </Link>
                  ) : (
                    <Link
                      to="/addGroup"
                      className="inline-block text-white font-bold py-2 px-4 sm:py-2 sm:px-6 md:py-3 md:px-8 text-xs sm:text-sm md:text-base rounded-lg transition transform hover:scale-105 duration-200 shadow-lg"
                      style={{ backgroundColor: "#FF00EE" }}
                    >
                      Create a Group
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
              {/* News Card */}
              <div
                className="border rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 hover:opacity-80 transition"
                style={{
                  background: "rgba(0, 242, 255, 0.1)",
                  borderColor: "#00F2FF",
                  borderWidth: "2px",
                }}
              >
                <h2
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3"
                  style={{ color: "#00F2FF" }}
                >
                  📰 News
                </h2>
                <div className="space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg font-medium">
                  <p>
                    Have your own chatroom,{" "}
                    <Link
                      to="/signup"
                      style={{ color: "#00F2FF" }}
                      className="hover:opacity-80 font-bold transition"
                    >
                      signup
                    </Link>{" "}
                    and go to
                    <Link
                      to="/explore"
                      style={{ color: "#00F2FF" }}
                      className="hover:opacity-80 font-bold transition"
                    >
                      {" "}
                      explore
                    </Link>
                    .
                  </p>
                  <p>
                    Advertise your stuff in{" "}
                    <Link
                      to="/chatZone/ADS"
                      style={{ color: "#00F2FF" }}
                      className="hover:opacity-80 font-bold transition"
                    >
                      ADS group
                    </Link>{" "}
                    for FREE.
                  </p>
                  <p>
                    Chat with AI{" "}
                    <Link
                      to="/robot"
                      style={{ color: "#00F2FF" }}
                      className="hover:opacity-80 font-bold transition"
                    >
                      HERE
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {/* Quick Tips Card */}
              <div
                className="border rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 hover:opacity-80 transition"
                style={{
                  background: "rgba(255, 0, 238, 0.1)",
                  borderColor: "#EAFF00",
                  borderWidth: "2px",
                }}
              >
                <h2
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3"
                  style={{ color: "#EAFF00" }}
                >
                  💡 Quick Tips
                </h2>
                <ul className="space-y-1 text-sm sm:text-sm md:text-base lg:text-lg font-medium">
                  <li className="flex items-start">
                    <span
                      className="mr-2 font-bold flex-shrink-0"
                      style={{ color: "#EAFF00" }}
                    >
                      •
                    </span>
                    <span>
                      Try{" "}
                      <Link
                        to="/profile"
                        style={{ color: "#EAFF00" }}
                        className="hover:opacity-80 transition"
                      >
                        logout
                      </Link>{" "}
                      &{" "}
                      <Link
                        to="/login"
                        style={{ color: "#EAFF00" }}
                        className="hover:opacity-80 transition"
                      >
                        login
                      </Link>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span
                      className="mr-2 font-bold flex-shrink-0"
                      style={{ color: "#EAFF00" }}
                    >
                      •
                    </span>
                    <span>SIGN UP for permanent username & profile</span>
                  </li>
                  <li className="flex items-start">
                    <span
                      className="mr-2 font-bold flex-shrink-0"
                      style={{ color: "#EAFF00" }}
                    >
                      •
                    </span>
                    <span>Check spam for email verification</span>
                  </li>
                  <li className="flex items-start">
                    <span
                      className="mr-2 font-bold flex-shrink-0"
                      style={{ color: "#EAFF00" }}
                    >
                      •
                    </span>
                    <span>Increase messages to create more groups</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Info Card */}
            <div
              className="border rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 text-center"
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                borderColor: "#00FF7B",
                borderWidth: "2px",
              }}
            >
              <h3
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2"
                style={{ color: "#00FF7B" }}
              >
                About ZODOMIX
              </h3>
              <p className="text-sm sm:text-base md:text-lg font-semibold">
                Creator:{" "}
                <span className="font-bold" style={{ color: "#00FF7B" }}>
                  Zodo
                </span>
              </p>
              <p className="text-sm sm:text-base md:text-lg font-semibold">
                Email:{" "}
                <span className="font-mono" style={{ color: "#00FF7B" }}>
                  sendtozodo@gmail.com
                </span>
              </p>
              <p className="text-xs opacity-75">Copyright © 2025 zodomix</p>
            </div>
            
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
