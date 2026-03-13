import { useState } from "react";
import toast from "react-hot-toast";

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, forgotPassword };
};

export default useForgotPassword;
