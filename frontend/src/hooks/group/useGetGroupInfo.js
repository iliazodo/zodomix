import { useState } from "react";

const useGetGroupInfo = () => {
  const [loading, setLoading] = useState(false);
  const getGroupInfo = async (groupName) => {
    setLoading(true);
    try {
      const res = await fetch("/api/group/getGroupById", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({groupName}),
      });

      const data = await res.json();

      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return { loading, getGroupInfo };
};

export default useGetGroupInfo;
