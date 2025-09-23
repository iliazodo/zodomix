import React from "react";

const Text = (props) => {
  return (
    <div className=" border-white border-2 border-l-fuchsia-600 border-b-fuchsia-600 rounded-3xl w-5/6 mx-auto p-3 break-words">
      <h2 className="md:text-4xl text-2xl pixel-font">{props.title}</h2>
      <br />
      <div className="lg:text-xl">{props.children}</div>
    </div>
  );
};

export default Text;
