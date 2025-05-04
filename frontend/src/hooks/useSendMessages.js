import { useState } from "react";
import toast from "react-hot-toast";

const useSendMessages = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async ({message} , groupName) => {
    setLoading(true);
    try {
      if (!message.trim()) {
        toast.error("FIELD IS EMPTY");
        return;
      }

      const res = await fetch(`http://localhost:3030/api/messages/send/${groupName}` , {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({message}),
        credentials: "include"
      })

      const data = await res.json();

    } catch (error) {
        toast.error(error.message);
    } finally{
        setLoading(false);
    }
  };

  return {sendMessage};
};

export default useSendMessages;
