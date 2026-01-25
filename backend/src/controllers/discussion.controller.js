import ProjectDiscussion from "../models/ProjectDiscussion.js";

export const createProjectDiscussion=async(req,res)=>{
    try {
        const projectId=req.params.projectId;
        const {message}=req.body;
        if(!message.trim()){
            return res.status(400).json({message:"Message cannot be empty"});
        }
        const newMessage=new ProjectDiscussion({
            projectId,
            sender:req.user._id,
            message
        });
        await newMessage.save();
        res.status(201).json({message:"Successfully created Message"});
    } catch (error) {
        console.log("Error in createProjectDiscussion controller",error);
        res.status(500).json("Internal Server Error");
    }
};

export const getProjectDiscussions=async(req,res)=>{
    try {
        const projectId=req.params.projectId;
        const discussions=await ProjectDiscussion.find({projectId}).populate("sender","username profilePic").sort({createdAt:1});
        res.status(200).json(discussions);
    } catch (error) {
        console.log("Error in getProjectDiscussions controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};