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
    <div className="flex flex-row z-0 md:mb-3">
      <img
        src={props.img}
        className="rounded-full w-16 h-16 md:w-20 md:h-20 mt-8"
        alt="avatar"
      />
      <div className="flex flex-col">
        <p className="-ml-12 md:-ml-16 mt-2 text-xs md:text-base pixel-font">{props.username}</p>
        <div className="bubble grow left break-words  text-base font-semibold xl:text-2xl md:text-xl max-w-64 min-w-10 md:max-w-xl lg:max-w-4xl">
          {renderMessageWithLinks(props.message)}
        </div>
      </div>
    </div>
  );
};

export default Message;
