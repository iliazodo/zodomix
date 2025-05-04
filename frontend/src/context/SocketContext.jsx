import { createContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket , setSocket] = useState(null);
    const {authUser} = useAuthContext();

    useEffect(() => {
        if(authUser){
            const socket = io("localhost:3333");

            setSocket(socket);
            return () => socket.close();
        } else {
            if(socket){
                socket.close();
                setSocket(null);
            }
        }
    } , [])

  return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>;
};
