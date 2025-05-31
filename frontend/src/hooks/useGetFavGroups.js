import { useState } from "react";

const useGetFavGroups = () => {
  const [favLoading , setFavLoading] = useState(false);
  const getFavGroups = async () => {
    setFavLoading(true);
    try {
      const res = await fetch("/api/group/getFavorite", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      const data = await res.json();

      return data;
      
    } catch (error) {
      console.log(error);
    } finally{
      setFavLoading(false);
    }
  };
  return {getFavGroups , favLoading};
};

export default useGetFavGroups;
