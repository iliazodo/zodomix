import { useState } from "react";
import toast from "react-hot-toast";

const useUnmuteUser = () => {
  const [unmuteLoading, setUnmuteLoading] = useState(false);

  const unmuteUser = async (targetId) => {
    setUnmuteLoading(true);
    try {
      const res = await fetch("/api/user/unmute", {
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
      setUnmuteLoading(false);
    }
  };

  return { unmuteLoading, unmuteUser };
};

export default useUnmuteUser;
