import { useState } from "react";
import toast from "react-hot-toast";

const useEditGroup = () => {
  const [loading, setLoading] = useState(false);

  const editGroup = async ({
    groupId,
    name,
    description,
    password,
    isPublic,
  }) => {
    setLoading(true);

    try {
      if (!name || !description) {
        toast.error("FIELDS CAN'T BE EMPTY");
        return;
      }

      const res = await fetch("/api/group/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ groupId, name, description, password }),
      });

      if (res.ok) {
        toast.success("GROUP EDITED SUCCESSFULLY");
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, editGroup };
};

export default useEditGroup;
