import { useState } from "react";


const useGetGroups = () => {
  const [loading , setLoading] = useState(false);
  const getGroups = async () => {
    setLoading(true);
    try {
        const res = await fetch("/api/group/get" , {
            method: "GET",
            headers: {"Content-Type" : "application/json"}
        })

        const data = await res.json();

        return data;

    } catch (error) {
      console.log(error.message);
    } finally{
      setLoading(false);
    }
  };

  return { loading ,getGroups };
};

export default useGetGroups;
