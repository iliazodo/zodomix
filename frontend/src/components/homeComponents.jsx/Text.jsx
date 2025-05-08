import React from "react";

const Text = (props) => {
  return (
    <div className=" mt-40 border-white border-2 w-5/6 mx-auto p-3 break-words">
      <h2 className="text-4xl">{props.title}</h2>
      <br />
      <p>{props.children}</p>
    </div>
  );
};

export default Text;
