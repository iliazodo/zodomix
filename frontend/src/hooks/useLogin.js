import  { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useLogin = () => {
    const [loading , setLoading] = useState(false);

    const {setAuthUser} = useAuthContext();

    const login = async ({username , password}) => {

        const checkFields = handleErrors({username , password});

        if(!checkFields) return;

        setLoading(true);

        try {

            const res = await fetch("/api/auth/login" , {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({username , password}),
                credentials: "include"
            })

            const data = await res.json();

            if(data.error){
                throw new Error(data.error);
            }

            localStorage.setItem("zdm-user" , JSON.stringify(data));
            
            setAuthUser(data);
            
        } catch (error) {
            toast.error(error.message);
        } finally{
            setLoading(false);
        }
    }

    return {loading , login};
}

export default useLogin

function handleErrors({username , email , password ,confirmPassword}){
    if(!username || !password){
        toast.error("PLEASE FILL IN ALL FIELDS")
        return false;
    }

    return true;
}