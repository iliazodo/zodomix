import { useState } from "react";
import toast from "react-hot-toast";

const useGetProfilePictures = () => {
  const [picturesLoading, setPicturesLoading] = useState(false);

  const getProfilePictures = async () => {
    setPicturesLoading(true);
    try {
      const res = await fetch("/api/user/pictures");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      toast.error(error.message);
      return [];
    } finally {
      setPicturesLoading(false);
    }
  };

  return { picturesLoading, getProfilePictures };
};

export default useGetProfilePictures;
