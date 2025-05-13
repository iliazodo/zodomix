import React from "react";

const renderMessageWithLinks = (message) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  const parts = message.split(urlPattern);

  return parts.map((part, index) =>
    urlPattern.test(part) ? (
      <a
        key={index}
        href={part}
        className="text-purple-600"
        target="_blank"
        rel="noopener noreferrer"
      >
        {part}
      </a>
    ) : (
      <span key={index}>{part}</span>
    )
  );
};

const Message = (props) => {
  return (
    <div className="flex flex-row z-0">
      <img
        src={props.img}
        className="rounded-full w-16 h-16 mt-8"
        alt="avatar"
      />
      <div className="flex flex-col">
        <p className="-ml-12 pixel-font">{props.username}</p>
        <div className="bubble grow left break-words text-xs xl:text-xl md:text-base max-w-64 min-w-10 md:max-w-xl lg:max-w-4xl">
          {renderMessageWithLinks(props.message)}
        </div>
      </div>
    </div>
  );
};

export default Message;
