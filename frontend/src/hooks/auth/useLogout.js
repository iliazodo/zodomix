import { useState } from "react"
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();

    const logout = async ()=> {
        setLoading(true);

        try {
                await fetch("/api/auth/logout" , {
                method:"POST",
                credentials: "include"
            })

            localStorage.removeItem("zdm-user");
        } catch (error) {
            console.log(error.message);
        } finally{
            setLoading(false);
            window.location.reload();
        }
    }

    return {loading , logout};
}

export default useLogout