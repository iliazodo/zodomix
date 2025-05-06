import React from "react";

const Message = (props) => {
  return (
    <div className="flex flex-row z-0">
      <img
        src={props.img}
        className="rounded-full w-16 h-16"
      />
      <div className="flex flex-col">
        <p>{props.username}</p>
        <div className="bubble grow left break-words max-w-96 min-w-52">
          {props.message}
        </div>
      </div>
    </div>
  );
};

export default Message;
