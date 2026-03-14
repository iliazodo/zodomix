import { useState } from "react";

const useGetCategories = () => {
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/category/get", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) return [];
      return data;
    } catch (error) {
      console.error(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, getCategories };
};

export default useGetCategories;
