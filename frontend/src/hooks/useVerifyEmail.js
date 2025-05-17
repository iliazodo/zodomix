import React, { useState } from "react";
import toast from "react-hot-toast";

const useVerifyEmail = () => {
  const [ loading, setLoading ] = useState(false);

  const verifyEmail = async (token) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/verify/${token}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      return res.ok;

    } catch (error) {
        toast.error(error.message);
    } finally{
        setLoading(false);
    }
  };

  return {loading , verifyEmail};
};

export default useVerifyEmail;
