import React, { useRef, useState } from "react";
import { Reply } from "lucide-react";
import { Filter } from "bad-words";

const filter = new Filter();

const sanitizeMessage = (message) => {
  return message.replace(/\S+/g, (word) => {
    const stripped = word.replace(/[^a-zA-Z0-9]/g, "");
    if (stripped && filter.isProfane(stripped)) {
      return word[0] + "*".repeat(word.length - 1);
    }
    return word;
  });
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

const THRESHOLD = 70;

const Message = (props) => {
  const [dragX, setDragX] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const triggered = useRef(false);

  const onStart = (x) => {
    startX.current = x;
    isDragging.current = true;
    triggered.current = false;
  };

  const onMove = (x) => {
    if (!isDragging.current) return;
    const delta = x - startX.current;
    if (delta > 0) {
      setDragX(Math.min(delta, THRESHOLD + 20));
      if (delta >= THRESHOLD && !triggered.current) {
        triggered.current = true;
        if (navigator.vibrate) navigator.vibrate(30);
      }
    } else {
      setDragX(0);
    }
  };

  const onEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (triggered.current) {
      props.handleReplyMsg(props.messageId, props.message);
    }
    setDragX(0);
    triggered.current = false;
  };

  const progress = Math.min(dragX / THRESHOLD, 1);

  return (
    <div className="relative">
      {/* Reply icon revealed behind the message as user drags */}
      {dragX > 0 && (
        <div
          className="absolute left-2 top-1/2 flex items-center justify-center pointer-events-none"
          style={{
            opacity: progress,
            transform: `translateY(-50%) scale(${0.5 + progress * 0.5})`,
          }}
        >
          <Reply className={`w-6 h-6 ${progress >= 1 ? "text-blue-400" : "text-gray-400"}`} />
        </div>
      )}

      {/* Draggable wrapper.
          IMPORTANT: transform is "none" when idle so no stacking context
          is created — this keeps the dropdown menu z-index working correctly. */}
      <div
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={(e) => { if (e.button !== 0) return; onStart(e.clientX); }}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        style={{
          transform: dragX > 0 ? `translateX(${dragX}px)` : "none",
          transition: dragX === 0 ? "transform 0.2s ease" : "none",
          userSelect: "none",
        }}
      >
        {/* Replying Display */}
        {props.reply && (
          <div className="relative">
            <div className="flex w-full h-8 items-center">
              <img
                className="w-8 h-8"
                src={`/profiles/${
                  props.reply?.senderId
                    ? props.reply?.senderId?.profilePic
                    : "defaultPic"
                }.png`}
              />
              <p className="break-all text-xs md:text-sm md:max-w-full">
                {props.reply?.message?.length > 50
                  ? sanitizeMessage(props.reply?.message).slice(0, 40) + "..."
                  : sanitizeMessage(props.reply?.message)}
              </p>
            </div>
            <div className="absolute z-0 ml-4 h-12 w-16 border-l-2 border-b-2 border-white"></div>
          </div>
        )}
        <div className={`${props.reply && "ml-8"} flex flex-row z-10 md:mb-2`}>
          <img
            src={props.img}
            className="z-10 rounded-full w-12 h-12 md:w-16 md:h-16 mt-6"
            alt="avatar"
          />
          <div className="flex flex-col">
            <div className=" flex items-center">
              <p className="-ml-9 md:-ml-12 mt-2 text-xs md:text-sm pixel-font">
                {props.username}{" "}
              </p>
              <span className="text-xs ml-2 mt-2">{props.time}</span>
            </div>
            <div className="bubble grow ">
              <div className="left pr-3 break-words relative text-sm font-semibold xl:text-lg md:text-base max-w-56 min-w-8 md:max-w-lg lg:max-w-3xl">
                {renderMessageWithLinks(props.message)}
              </div>

              <button
                role="button"
                className="dropdown dropdown-end absolute h-8 w-8 -right-4 -top-1"
              >
                <img src="/menuIcon.png" alt="options" />
                <ul className="text-white menu dropdown-content bg-base-100 rounded-box shadow-sm">
                  <li>
                    <a onClick={() => props.handleReplyMsg(props.messageId, props.message)}>Reply</a>
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
    </div>
  );
};

export default Message;
