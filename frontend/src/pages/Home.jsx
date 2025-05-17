import React from "react";

import Header from "../components/Nav.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import Text from "../components/homeComponents.jsx/Text.jsx";

const Home = () => {
  const { authUser } = useAuthContext();

  return (
    <>
      <Header />
      <div className="overflow-auto h-screen grid grid-cols-1 md:grid-cols-2 py-32 gap-20">
        <Text title={`Hey ${authUser ? authUser.username : "Guest"},`}>
          ZODOMIX is a ANONYMOUS chatroom.
          <br />
          Say WHATEVER you want.
          <br/>
          Your Human Number is {authUser ? authUser.humanNum : "00000000"}
        </Text>

        <Text title={"News"}>
          You can do advertise in ADS group for FREE.
          <br/>
          For having permanent username and profile picture SIGN UP!
        </Text>

        <Text title={"Updates"}>
          If there was any error or bug try Logout and Login again.
          <br/>
          For verifying your email check your spam folder too!
        </Text>

        <Text title={"About"}>
        Creator: Zodo
        <br/>
        Email: sendtozodo@gmail.com
        </Text>
      </div>
    </>
  );
};

export default Home;
