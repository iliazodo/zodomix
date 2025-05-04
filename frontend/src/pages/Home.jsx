import React from "react";

import Header from "../components/Nav.jsx";

const Home = () => {
  return (
  <>
    <Header/>
    <div className=" overflow-auto h-screen">
      <div className=" mt-40 border-white border-2 w-5/6 mx-auto p-3 break-words">
        <span className="">Hello zodo,</span>
        <br/>
        website explaination
      </div>

      <div className=" m-28 border-white border-2 w-5/6 mx-auto p-3 break-words">
        <span className="">Latest news</span>

      </div>

      <div className=" m-28 border-white border-2 w-5/6 mx-auto p-3 break-words">

      </div>

    </div>
  </>
  );
};

export default Home;
