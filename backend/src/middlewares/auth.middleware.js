import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import User from "../models/User.js";

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.DevLooptoken;
        if(!token){
            return res.status(401).json({message:"Token Not provided"});
        }

        let decoded;
        try{
            decoded=jwt.verify(token,ENV.JWT_SECRET);
        }
        catch(error){
            if(error.name==="TokenExpiredError"){
                return res.status(401).json({message:"Token Expired"});
            }
            return res.status(401).json({message:"Invalid Token"});
        }

        const userId=decoded.userId;
        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User does not exist"});
        }
        req.user=user;
        next();
    }
    catch(error){
        console.log("Error in protect middleware",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}