import  {useState} from 'react'
import toast from "react-hot-toast";
import { useAuthContext } from '../context/AuthContext';

const useSignup = () => {

    const [loading , setLoading] = useState(false);

    const {setAuthUser} = useAuthContext();

    const signUp = async ({username , email , password , confirmPassword}) => {
        const checkFields = handleErrors({username , email , password , confirmPassword});

        if(!checkFields) return;

        setLoading(true);
        try {
            const res = await fetch("https://zodomix.onrender.com/api/auth/signup" , {
                method:"POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({username , email , password , confirmPassword}),
                credentials: "include"
            })

            const data = await res.json();
            
            if(data.error){
                throw new Error(data.error);
            }

            localStorage.setItem("zdm-user" , JSON.stringify(data));

            setAuthUser(data);

        } catch (error) {
            console.log(error.message);
        } finally{
            setLoading(false);
        }
    }

    return {loading , signUp};

}

export default useSignup

function handleErrors({username , email , password ,confirmPassword}){
    if(!username || !email || !password || !confirmPassword){
        toast.error("PLEASE FILL IN ALL FIELDS")
        return false;
    }

    if(password.length <= 6){
        toast.error("PASSWORD MUST BE AT LEAST 6 CHARACTERS");
        return false;
    }

    if(username.length >= 25){
        toast.error("USERNAME MUST BE LESS THAN 25 CHARACTERS");
        return false;
    }

    return true;
}