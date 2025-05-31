import toast from "react-hot-toast";

const useAddFavGroup = () => {
  const addFavGroup = async (groupId) => {
    try {
      const res = await fetch("/api/group/addFavorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ groupId }),
      });

      if (res.status === 401) {
        toast.error("LOGIN OR SIGNUP FOR THIS OPTION");
      }

      return res;
    } catch (error) {
      console.log(error.message);
    }
  };
  return { addFavGroup };
};

export default useAddFavGroup;
