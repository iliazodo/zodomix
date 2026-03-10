import { useState } from "react";


const useGetMessages = () => {
    const [getChatLoading , setGetChatLoading] = useState(false);
    const getMessages = async (groupName, page = 1) => {
        setGetChatLoading(true);
        try {
            const res = await fetch(`/api/messages/get/${groupName}?page=${page}` , {
                method: "GET",
                headers: {"Content-Type" : "application/json"},
                credentials: "include"
            });

            const data = await res.json();
            return data; // { messages, hasMore }

        } catch (error) {
            console.log(error.message);
            return { messages: [], hasMore: false };
        } finally{
            setGetChatLoading(false);
        }

    }

    return {getChatLoading , getMessages};
}

export default useGetMessages