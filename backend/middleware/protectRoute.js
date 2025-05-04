import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (req , res , next) => {
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({error:"NO TOKEN PROVIDED"});
        }
    
        const decode = jwt.verify(token , process.env.JWT_SECRET);
    
        if(!decode){
            return res.status(401).json({error:"TOEKN NOT MATCH"});
        }
    
        const user = await User.findById(decode.userId).select("-password");
    
        if(!user){
            return res.status(404).json({error:"USER NOT FOUND"});
        }
    
        req.user = user;
        
        next();
    } catch (error) {
        console.log("ERROR IN PROTECTROUTE: " , error);
        res.status(500).json({error:"INTERNAL SERVER ERROR"});
    }
}

export default protectRoute;