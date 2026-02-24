import toast from "react-hot-toast";

const useAddMember = () => {
  const addVoiceMember = async ({socketId, groupId}) => {
    try {
      const res = await fetch("/api/voice/addVoiceMember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ socketId, groupId }),
      });

      return res;
    } catch (error) {
      console.log(error.message);
    }
  };
  return { addVoiceMember };
};

export default useAddMember;
