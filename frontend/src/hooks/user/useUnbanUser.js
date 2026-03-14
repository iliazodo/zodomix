import { useState } from "react";
import toast from "react-hot-toast";

const useUnbanUser = () => {
  const [unbanLoading, setUnbanLoading] = useState(false);

  const unbanUser = async (targetId) => {
    setUnbanLoading(true);
    try {
      const res = await fetch("/api/user/unblock", {
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
      setUnbanLoading(false);
    }
  };

  return { unbanLoading, unbanUser };
};

export default useUnbanUser;
