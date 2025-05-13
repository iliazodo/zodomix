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
        <Text title={`Hey ${authUser.username},`}>
          ZODOMIX is a ANONYMOUS chatroom where you can use goups for chat.
          <br />
          say WHATEVER you want.
        </Text>

        <Text title={"News"}>
          You can do advertise in ADS group for FREE.
        </Text>

        <Text title={"Updates"}>
          All main groups added.
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
