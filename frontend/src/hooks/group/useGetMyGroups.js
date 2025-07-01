import { useState } from "react";

const useGetMyGroups = () => {
  const [groupLoading, setGroupLoading] = useState(false);

  const getMyGroups = async () => {
    setGroupLoading(true);
    try {
      const res = await fetch(`/api/group/getMyGroups`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      return data;
    } catch (error) {
      console.log(error.message);
    } finally {
      setGroupLoading(false);
    }
  };

  return { groupLoading, getMyGroups };
};

export default useGetMyGroups;
