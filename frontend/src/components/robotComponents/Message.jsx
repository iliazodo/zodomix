import React from "react";

const bannedWords = [
  "nigger",
  "nigga",
  "niga",
  "n i g a",
  "n i g g e r",
  "Nigger",
  "NIGGER",
];

const sanitizeMessage = (message) => {

  let sanitized = message;
  bannedWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    sanitized = sanitized.replace(regex, "****");
  });
  return sanitized;
};

const renderMessageWithLinks = (message) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const sanitizedMessage = sanitizeMessage(message);
  const parts = sanitizedMessage.split(urlPattern);

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
    <div>
      <div className={`flex flex-row z-10 md:mb-3`}>
        <img
          src={props.img}
          className="z-10 rounded-full w-16 h-16 md:w-20 md:h-20 mt-8"
          alt="avatar"
        />
        <div className="flex flex-col">
          <div className=" flex items-center">
            <p className="-ml-12 md:-ml-16 mt-2 text-xs md:text-base pixel-font">
              {props.username}{" "}
            </p>
            <span className="md:text-sm text-xs ml-3 mt-2">{props.time}</span>
          </div>
          <div className="bubble grow ">
            <div className="left pr-3 break-words relative text-base font-semibold xl:text-2xl md:text-xl max-w-64 min-w-10 md:max-w-xl lg:max-w-4xl">
              {renderMessageWithLinks(props.message)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
