import { useState } from "react";
import toast from "react-hot-toast";

const useSendMessages = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async ({message , id}) => {
    setLoading(true);
    try {
      if (!message.trim()) {
        toast.error("FIELD IS EMPTY");
        return;
      }

      const res = await fetch("/api/ai/message/send" , {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({message , tempUser: id}),
        credentials: "include"
      })

      if(res.status == 429){
        toast.error("TOO MANY MESSAGES SENT, PLEASE TRY 1MIN LATER");
      }


    } catch (error) {
        console.log(error.message);
    } finally{
        setLoading(false);
    }
  };

  return {loading , sendMessage};
};

export default useSendMessages;
