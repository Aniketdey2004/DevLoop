import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import axios from "axios";
import cloudinary from "./cloudinary.js";


export const generateWebToken=(userId,res)=>{
    const {JWT_SECRET}=ENV;
    if(!JWT_SECRET){
        throw new Error("JWT Secret is required");
    }

    const token=jwt.sign({userId},JWT_SECRET,{
        expiresIn:"7d"
    });

    res.cookie("DevLooptoken",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:ENV.NODE_ENV==="development"?false:true
    });

    return token;
}


export const uploadImageToCloudinary=async(imageUrl)=>{
   const response=await axios.get(imageUrl,{
        responseType:"arraybuffer"
    });

    const base64Image=Buffer.from(response.data).toString("base64");
    const result=await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`);
    return result.secure_url;
}