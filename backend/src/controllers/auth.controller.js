import { generateWebToken, uploadImageToCloudinary } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import { sendWelcomeMail } from "../emails/emailHandler.js";
import {OAuth2Client} from "google-auth-library";

const client=new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

export const signup= async(req,res)=>{
    const {username, email, password}=req.body;
    try{
        if(!username?.trim() || !email || !password){
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

        const user=await User.exists({email});

        if(user){
            return res.status(409).json({message:"User already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            username,
            email,
            password:hashedPassword
        });
        await newUser.save();
        generateWebToken(newUser._id,res);
        res.status(201).json({message:"User Created Successfully"});

        const profileUrl=ENV.CLIENT_URL+"/profile/"+newUser.username;
        try{
            await sendWelcomeMail(newUser.username,newUser.email,profileUrl);
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
    const {email,password}=req.body;
    try{
        if(!email?.trim() || !password?.trim()){
            return res.status(400).json({message:"All fields are required"});
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid Credentials"});
        }
        if(user.googleId){
            return res.status(401).json({message:"Invalid Credentials"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid Credentails"});
        }

        generateWebToken(user._id,res);
        res.status(200).json({message:"Logged in Successfully"});
    }
    catch(error){
        console.log("error in login controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const logout=(_,res)=>{
    res.clearCookie("DevLooptoken");
    res.status(200).json({message:"Logged out successfully"});
};

export const getCurrentUser=async(req,res)=>{
    res.status(200).json(req.user);
}

export const loginThroughGmail=async(req,res)=>{
    try {
        const {token}=req.body;
        if(!token){
            return res.status(400).json({message:"Google token is required"});
        }
        let ticket;
        try {
            ticket=await client.verifyIdToken({
                idToken:token,
                audience:ENV.GOOGLE_CLIENT_ID
            });
        } catch (error) {
            console.log("Invalid token given");
            return res.status(401).json({message:"Invalid Google token"});
        }
        const payload=ticket.getPayload();
        if(!payload){
            return res.status(401).json({message:"Invalid Google token"});
        }

        const {sub,email,name,picture}=payload;
        let user=await User.findOne({email});
        if(!user){
            const profilePic = picture ? await uploadImageToCloudinary(picture) : null;
            user=await User.create({
                googleId:sub,
                email,
                username:name,
                profilePic
            });
            return res.status(201).json({message:"User Successfully created"});
        }
        generateWebToken(user._id,res);
        res.status(200).json({message:"Logged In Successfully"});
    } catch (error) {
        console.log("error in loginThroughGmail controller",error);
        res.status(500).json({message:"Internal Server Errro"});
    }
}