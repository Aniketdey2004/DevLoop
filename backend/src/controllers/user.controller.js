import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

export const getSuggestedConnections=async(req,res)=>{
    try{
        const connections=req.user.connections;
        const suggestedConnections=await User.find({
            _id:{
                $ne:req.user._id,
                $nin:connections
            }
        }).select("name username headline profilePic").limit(5);
        res.status(200).json(suggestedConnections);
    }
    catch(error){
        console.log("error in getSuggestedConnections controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const getPublicProfile=async(req,res)=>{
    try{
        const {username}=req.params;
        const user=await User.findOne({username}).select("-password");
        res.status(200).json(user);
    }   
    catch(error){
        console.log("Error in getPublicProfile Controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

//review it later might require changes
export const updateProfile=async(req,res)=>{
    try{
        const {username,email}=req.body;
        const user=await User.exists({
           _id:{$ne:req.user._id},
            $or:[
                {username},
                {email},
            ]
        });
        if(user){
            return res.status(409).json({message:"Username or email already used"});
        }
        const allowedFields=[
            "name",
            "username",
            "email",
            "location",
            "about",
            "headline",
            "githubUrl",
            "skills",
            "experience",
            "education",
            "projects"
        ];
        const updatedBody={};
        for(const field of allowedFields){
            if(req.body[field]!==undefined){
                updatedBody[field]=req.body[field];
            }
        }
        const {profilePic, bannerImg}=req.body;
        if(profilePic){
            const profileImgResponse=await cloudinary.uploader.upload(profilePic);
            updatedBody["profilePic"]=profileImgResponse.secure_url;
        }

        if(bannerImg){
            const bannerImgResponse=await cloudinary.uploader.upload(bannerImg);
            updatedBody["bannerImg"]=bannerImgResponse.secure_url;
        }

        const updatedUser=await User.findByIdAndUpdate(req.user._id,{$set:updatedBody},{new:true}).select("-password");

        res.status(200).json(updatedUser);
    }
    catch(error){
        console.log("error in updateProfile controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};
