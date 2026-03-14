import { useState } from "react";

const useGetGroups = () => {
  const [loading, setLoading] = useState(false);

  const getGroups = async (page = 1, signal) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/group/get?page=${page}&limit=30`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal,
      });

      const data = await res.json();
      return data; // { groups, hasMore }
    } catch (error) {
      if (error.name !== "AbortError") console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getGroups };
};

export default useGetGroups;
