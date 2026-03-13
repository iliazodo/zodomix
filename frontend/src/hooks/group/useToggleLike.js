import toast from "react-hot-toast";

const useToggleLike = () => {
  const toggleLike = async (groupId) => {
    try {
      const res = await fetch("/api/group/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ groupId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  return { toggleLike };
};

export default useToggleLike;
