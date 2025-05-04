import toast from "react-hot-toast";


const useGetMessages = () => {
    const getMessages = async (groupName) => {
        try {
            const res = await fetch(`http://localhost:3030/api/messages/get/${groupName}` , {
                method: "GET",
                headers: {"Content-Type" : "application/json"},
                credentials: "include"
            });

            const data = await res.json();

            return data;
            
        } catch (error) {
            toast.error(error.message);
            return [];
        }
    }

    return {getMessages};
}

export default useGetMessages