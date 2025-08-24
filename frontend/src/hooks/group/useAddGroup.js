import { useState } from "react";
import toast from "react-hot-toast";

const useAddGroup = () => {
  const [loading, setLoading] = useState(false);

  const addGroup = async ({ name, description, isPublic, isAnonymous, password }) => {
    setLoading(true);

    try {
      if (!name || !description) {
        toast.error("PLEASE FILL ALL FIELDS");
        return;
      }

      if (!isPublic && !password) {
        toast.error("PRIVATE GROUPS NEED PASSWORD");
        return;
      }

      const res = await fetch("/api/group/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description, isPublic, isAnonymous, password }),
      });

      const data = await res.json();

      if(res.status === 403){
        toast.error(data.error);
      }

      return res.ok;
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, addGroup };
};

export default useAddGroup;
