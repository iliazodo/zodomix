import { createContext, useContext, useEffect, useState } from "react";
import useIsUserValid from "../hooks/user/isUserValid.js"

const {isUserValid} = useIsUserValid();

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {

    const [authUser , setAuthUser] = useState(JSON.parse(localStorage.getItem("zdm-user")) || null);

    useEffect(() =>{
      isUserValid();
    } , []);

  return <AuthContext.Provider value={{authUser ,setAuthUser}}>{children}</AuthContext.Provider>;
};
