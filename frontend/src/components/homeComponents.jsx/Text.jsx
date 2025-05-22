import React from "react";

const Text = (props) => {
  return (
    <div className=" border-white border-2 rounded-3xl w-5/6 mx-auto p-3 break-words">
      <h2 className="md:text-4xl text-2xl pixel-font">{props.title}</h2>
      <br />
      <p className="lg:text-xl">{props.children}</p>
    </div>
  );
};

export default Text;
