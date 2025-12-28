import { generateWebToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import { sendWelcomeMail } from "../emails/emailHandler.js";

export const signup= async(req,res)=>{
    const {name, username, email, password}=req.body;
    try{
        if(!name?.trim() || !username?.trim() || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password length must be atleast 6"});
        }
        
        //check if email is valid regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        }

        const user=await User.exists({
            $or:[
                {email},
                {username}
            ]
        });

        if(user){
            return res.status(409).json({message:"User already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            name,
            username,
            email,
            password:hashedPassword
        });
        await newUser.save();
        generateWebToken(newUser._id,res);
        res.status(201).json({
            _id:newUser._id,
            name:newUser.name,
            email:newUser.email
        });

        const profileUrl=ENV.CLIENT_URL+"/profile/"+newUser.username;
        try{
            await sendWelcomeMail(newUser.name,newUser.email,profileUrl);
        }
        catch(emailError){
            console.log("Error in sending welcome email:",emailError);
        }
    }
    catch(error){
        console.log("error in signup controller",error);
        if (error.code === 11000) {
            return res.status(409).json({message: "Email or username already exists"});
        }
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const login=async(req,res)=>{
    const {username,password}=req.body;
    try{
        if(!username?.trim() || !password?.trim()){
            return res.status(400).json({message:"All fields are required"});
        }

        const user=await User.findOne({username});
        if(!user){
            return res.status(401).json({message:"Invalid Credentials"});
        }

        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid Credentails"});
        }

        generateWebToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            name:user.name,
            username:user.username,
            email:user.email
        });
    }
    catch(error){
        console.log("error in login controller",error);
        res.status(500).json({message:"Internal Server Errro"});
    }
};

export const logout=(_,res)=>{
    res.clearCookie("DevLooptoken");
    res.status(200).json({message:"Logged out successfully"});
};

export const getCurrentUser=async(req,res)=>{
    res.status(200).json(req.user);
}