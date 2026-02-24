import toast from "react-hot-toast";

const useRemoveMember = () => {
  const removeVoiceMember = async ({socketId, groupId}) => {
    try {
      const res = await fetch("/api/voice/removeVoiceMember", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ socketId, groupId }),
      });

      return res;
    } catch (error) {
      console.log(error.message);
    }
  };
  return { removeVoiceMember };
};

export default useRemoveMember;
