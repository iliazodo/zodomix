import { useState } from "react";

const useGetLists = () => {
  const [listsLoading, setListsLoading] = useState(false);

  const getLists = async () => {
    setListsLoading(true);
    try {
      const res = await fetch("/api/user/lists", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      return { muteList: [], blockList: [] };
    } finally {
      setListsLoading(false);
    }
  };

  return { listsLoading, getLists };
};

export default useGetLists;
