import { useState } from "react";
import toast from "react-hot-toast";

const useSendPass = () => {
  const [passLoading, setPassLoading] = useState(false);

  const sendPass = async ({ groupId, password }) => {
    setPassLoading(true);
    try {
      const res = await fetch(`/api/group/sendPass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ groupId, password }),
      });

      if(!res.ok){
        toast.error("WRONG PASSWORD");
      }

      return res.ok;
    } catch (error) {
      console.log(error.message);
    } finally {
        setPassLoading(false);
    }
  };
  return {passLoading , sendPass};
};

export default useSendPass;
