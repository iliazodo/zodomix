import { useState } from "react";
import toast from "react-hot-toast";

const useDeleteGroup = () => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteGroup = async (groupId) => {
    setDeleteLoading(true);

    try {
      const res = await fetch("/api/group/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ groupId }),
      });

      if (res.ok) {
        toast.success("GROUP DELETED SUCCESSFULLY");
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return { deleteLoading, deleteGroup };
};

export default useDeleteGroup;
