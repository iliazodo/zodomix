import { useState } from "react";


const useGetUser = () => {
    const [getUserLoading , setGetUserLoading] = useState(false);
    const getUser = async (userId) => {
        setGetUserLoading(true);
        try {
            const res = await fetch("https://zodomix.com/api/user/getInfo" , {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({userId: userId})
            })

            const data = await res.json();

            return data;

        } catch (error) {
            console.log(error.message);
        } finally{
            setGetUserLoading(false);
        }
    }

    return { getUserLoading , getUser};
}

export default useGetUser