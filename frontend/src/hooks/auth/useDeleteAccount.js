import { useState } from "react";
import toast from "react-hot-toast";

const useDeleteAccount = () => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "FAILED TO DELETE ACCOUNT");
        return false;
      }
      return true;
    } catch (error) {
      toast.error("SOMETHING WENT WRONG");
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return { deleteLoading, deleteAccount };
};

export default useDeleteAccount;
