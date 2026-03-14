import { useState } from "react";
import toast from "react-hot-toast";

const useMuteUser = () => {
  const [muteLoading, setMuteLoading] = useState(false);

  const muteUser = async (targetId) => {
    setMuteLoading(true);
    try {
      const res = await fetch("/api/user/mute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setMuteLoading(false);
    }
  };

  return { muteLoading, muteUser };
};

export default useMuteUser;
