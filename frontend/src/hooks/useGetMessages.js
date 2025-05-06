import toast from "react-hot-toast";


const useGetMessages = () => {
    const getMessages = async (groupName) => {
        try {
            const res = await fetch(`https://zodomix.onrender.com/api/messages/get/${groupName}` , {
                method: "GET",
                headers: {"Content-Type" : "application/json"},
                credentials: "include"
            });

            const data = await res.json();

            return data;
            
        } catch (error) {
            console.log(error.message);
            return [];
        }
    }

    return {getMessages};
}

export default useGetMessages