import React from "react";

const Message = (props) => {
  return (
    <div className="flex flex-row z-0">
      <img
        src={props.img}
        className="rounded-full w-16 h-16 mt-8"
      />
      <div className="flex flex-col">
        <p className="-ml-12 pixel-username">{props.username}</p>
        <div className="bubble grow left break-words max-w-96 min-w-10 md:max-w-xl lg:max-w-4xl">
          {props.message}
        </div>
      </div>
    </div>
  );
};

export default Message;
