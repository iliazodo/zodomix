import React, { useEffect } from "react";

const AlertMessage = (props) => {

  useEffect(() => {
    setTimeout(() => {
      document.getElementById(`message-${props.message}`).classList.add("hidden");
    }, 1400);
  }, []);

  return (
    <div
      id={`message-${props.message}`}
      className="opAnimate rounded-full p-5 absolute left-1/2 top-24 -translate-x-1/2 bg-black z-50 text-4xl"
    >
      {props.message}
    </div>
  );
};

export default AlertMessage;
