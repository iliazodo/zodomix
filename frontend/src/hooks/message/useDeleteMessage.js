import { useState } from "react";


const useDeleteMessage = () => {
    const [deleteChatLoading , setDeleteChatLoading] = useState(false);
    const deleteMessage = async (messageId) => {
        setDeleteChatLoading(true);
        try {
            const res = await fetch("/api/messages/delete" , {
                method: "DELETE",
                headers: {"Content-Type" : "application/json"},
                credentials: "include",
                body: JSON.stringify({messageId})
            });

            return res;
            
        } catch (error) {
            console.log(error.message);
            return [];
        } finally{
            setDeleteChatLoading(false);
        }

    }

    return {deleteChatLoading , deleteMessage};
}

export default useDeleteMessage