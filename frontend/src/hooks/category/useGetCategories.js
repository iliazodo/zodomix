import { useState } from "react";

const useGetCategories = () => {
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/category/get", { credentials: "include" });
      if (!res.ok) return [];
      const data = await res.json();
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
