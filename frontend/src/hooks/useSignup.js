import  {useState} from 'react'
import toast from "react-hot-toast";

const useSignup = () => {

    const [loading , setLoading] = useState(false);


    const signUp = async ({website , username , email , password , confirmPassword}) => {
        const checkFields = handleErrors({website , username , email , password , confirmPassword});

        if(!checkFields) return;

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup" , {
                method:"POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({username , email , password , confirmPassword}),
                credentials: "include"
            })

            const data = await res.json();
            
            if(data.error){
                throw new Error(data.error);
            }

              toast.success("PLEASE VERIFY YOUR EMAIL");

              return res;

        } catch (error) {
            toast.error(error.message);
        } finally{
            setLoading(false);
        }
    }

    return {loading , signUp};

}

export default useSignup

function handleErrors({website ,username , email , password ,confirmPassword}){
    if(!username || !email || !password || !confirmPassword){
        toast.error("PLEASE FILL IN ALL FIELDS")
        return false;
    }

    if(password.length < 6){
        toast.error("PASSWORD MUST BE AT LEAST 6 CHARACTERS");
        return false;
    }

    if(username.length >= 25){
        toast.error("USERNAME MUST BE LESS THAN 25 CHARACTERS");
        return false;
    }

    if(website){
        toast.error("DON'T FILL WEBSITE FIELD");
        return false;
    }

    return true;
}