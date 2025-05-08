import React from "react";

import Header from "../components/Nav.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import Text from "../components/homeComponents.jsx/Text.jsx";

const Home = () => {
  const { authUser } = useAuthContext();

  return (
    <>
      <Header />
      <div className=" overflow-auto h-screen">
        <Text title={`Hey ${authUser.username},`}>
          ZODOMIX is a ANONYMOUS chatroom where you can use goups for chat.
          <br />
          say WHATEVER you want.
        </Text>

        <Text title={"News"}>
        
        </Text>

        <Text title={"Updates"}>
          Now realtime chat is working.
        </Text>
      </div>
    </>
  );
};

export default Home;
