import { useState } from "react";


const useGetMessages = () => {
    const [getChatLoading , setGetChatLoading] = useState(false);
    const getMessages = async (groupName) => {
        setGetChatLoading(true);
        try {
            const res = await fetch(`https://zodomix.com/api/messages/get/${groupName}` , {
                method: "GET",
                headers: {"Content-Type" : "application/json"},
                credentials: "include"
            });

            const data = await res.json();

            return data;
            
        } catch (error) {
            console.log(error.message);
            return [];
        } finally{
            setGetChatLoading(false);
        }

    }

    return {getChatLoading , getMessages};
}

export default useGetMessages