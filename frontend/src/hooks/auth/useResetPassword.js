import { useState } from "react";
import toast from "react-hot-toast";

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (token, password, confirmPassword) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, resetPassword };
};

export default useResetPassword;
