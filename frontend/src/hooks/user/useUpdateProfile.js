import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext.jsx";

const useUpdateProfile = () => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const updateProfile = async (data) => {
    setUpdateLoading(true);
    try {
      const res = await fetch("/api/user/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      localStorage.setItem("zdm-user", JSON.stringify(json));
      setAuthUser(json);
      return json;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return { updateLoading, updateProfile };
};

export default useUpdateProfile;
