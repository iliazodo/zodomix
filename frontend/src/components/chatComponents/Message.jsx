import React from "react";

const bannedWords = [
  "badword1",
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
      {/* Replying Display */}
      {props.reply && (
        <div className="relative">
          <div className="flex w-full h-10 items-center">
            <img
              className="w-10 h-10"
              src={`/profiles/${
                props.reply?.senderId
                  ? props.reply?.senderId?.profilePic
                  : "defaultPic"
              }.png`}
            />
            <p className="break-all text-xs md:text-lg md:max-w-full">
              {props.reply?.message?.length > 50
                ? props.reply?.message.slice(0, 40) + "..."
                : props.reply?.message}
            </p>
          </div>
          <div className="absolute z-0 ml-5 h-16 w-20 border-l-2 border-b-2 border-white"></div>
        </div>
      )}
      <div className={`${props.reply && "ml-10"} flex flex-row z-10 md:mb-3`}>
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

            <button
              role="button"
              className="dropdown dropdown-end absolute h-10 w-10 -right-5 -top-2"
            >
              <img src="/menuIcon.png" alt="options" />
              <ul className="text-white menu dropdown-content bg-base-100 rounded-box shadow-sm">
                <li>
                  <a onClick={() => props.handleReplyMsg(props.messageId , props.message)}>Reply</a>
                </li>
                <li>
                  <a onClick={() => props.handleCopyMsg(props.message)}>Copy</a>
                </li>
                <li>
                  <a onClick={() => props.handleDeleteMsg(props.messageId)}>Delete</a>
                </li>
              </ul>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
