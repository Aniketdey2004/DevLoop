import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

export const getSuggestedAccounts=async(req,res)=>{
    try{
        const following=req.user.following;
        const suggestedAccounts=await User.find({
            _id:{
                $ne:req.user._id,
                $nin:following
            }
        }).select("name username headline profilePic").limit(5);
        res.status(200).json(suggestedAccounts);
    }
    catch(error){
        console.log("error in getSuggestedConnections controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const getPublicProfile=async(req,res)=>{
    try{
        const {username}=req.params;
        const user=await User.findOne({username}).select("-password").populate("projects","title description gihtubRepo liveUrl");
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


export const followUser=async(req,res)=>{
    const userId=req.params._id;
    try {
        if(req.user.following.includes(userId))
        {
            return res.status(400).json({message:"You already follow"});
        }
        const user=await User.exists({_id:userId});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        await User.findByIdAndUpdate(req.user._id,{$addToSet:{following:userId}});
        const followedUser=await user.findByIdAndUpdate(userId,{$addToSet:{followers:req.user._id}});
        res.status(200).json({message:`Followed ${followUser.username}`});

    } catch (error) {
        console.log("Error in followUser controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const unfollowUser=async(req,res)=>{
    const userId=req.params._id;
    try {
        if(!req.user.following.includes(userId)){
            return res.status(400).json({message:"You don't follow these user"});
        }
        await User.findByIdAndUpdate(req.user._id,{$pull:{following:userId}});
        await User.findByIdAndUpdate(userId,{$pull:{followers:req.user._id}});
        res.status(200).json({message:"Unfollowed User"});
    } catch (error) {
        console.log("Error in unfollow Controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const getFollowers=async(req,res)=>{
    try {
        const followers=await User.find({_id:{$in:req.user.followers}}).select("name username profilePic headline");
        res.status(200).json(followers);
    } catch (error) {
        console.log("Error in getFollowers controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const getFollowing=async(req,res)=>{
    try {
        const following=await User.find({_id:{$in:req.user.following}}).select("name username profilePic headline");
        res.status(200).json(following);
    } catch (error) {
        console.log("Error in getFollowing controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};