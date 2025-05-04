import toast from "react-hot-toast";


const useGetUser = () => {
    const getUser = async (userId) => {
        try {
            const res = await fetch("https://zodomix.onrender.com/api/user/getInfo" , {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({userId: userId})
            })

            const data = await res.json();

            return data;

        } catch (error) {
            toast.error(error.message);
        }
    }

    return {getUser};
}

export default useGetUser