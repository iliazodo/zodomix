import { useState } from "react";
import toast from "react-hot-toast";

const useBanUser = () => {
  const [banLoading, setBanLoading] = useState(false);

  const banUser = async (targetId) => {
    setBanLoading(true);
    try {
      const res = await fetch("/api/user/block", {
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
      setBanLoading(false);
    }
  };

  return { banLoading, banUser };
};

export default useBanUser;
