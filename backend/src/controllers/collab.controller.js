import CollabRequest from "../models/CollabRequest.js";
import Project from "../models/Project.js";

import Notification from "../models/Notification.js";

export const sendCollabRequest=async(req,res)=>{
    try {
        const {projectId}=req.params;
        const project=await Project.findById(projectId);
        if(!project){
            return res.status(404).json({message:"Project does not exist"});
        }
        if(project.ownerId.toString()===req.user._id.toString()){
            return res.status(400).json({message:"You cannot send a collab request to yourself"});
        }
        if(project.collaborators.includes(req.user._id)){
            return res.status(409).json({message:"You are already a collaborator"});
        }

        const existingRequest=await CollabRequest.exists({sender:req.user._id,receiver:project.ownerId,status:"pending"});
        if(existingRequest){
            return res.status(409).json({message:"You have already sent a request"});
        }
        const rejectedRequest=await CollabRequest.exists({sender:req.user._id,receiver:project.ownerId,status:"rejected"});
        if(rejectedRequest){
            return res.status(400).json({message:"You have been rejected already"});
        }
        const newRequest=new CollabRequest({
            sender:req.user._id,
            receiver:project.ownerId,
            status:"pending",
            project:projectId,
        });
        await newRequest.save();
        res.status(201).json({message:"Connectiion request sent successfully"});
    } catch (error) {
        console.log("Error in sendCollabRequest controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const acceptCollabRequest=async(req,res)=>{
    try {
        const {requestId}=req.params;
        const userId=req.user._id;
        const request=await CollabRequest.findById(requestId);
        if(!request){
            return res.status(404).json({message:"Collab Request not found"});
        }
        //check if request receiver is current user
        if(request.receiver.toString()!==userId.toString()){
            return res.status(403).json({message:"You are not authorized to accept this request"});
        }

        if(request.status!=="pending"){
            return res.status(400).json({message:"Request had already been procesed"});
        }

        request.status="accepted";
        await request.save();

        await Project.findByIdAndUpdate(request.project,{$push:{collaborators:userId}});

        const newNotification=new Notification({
            recipient:request.sender,
            relatedUser:userId,
            type:"collabAccepted",
            projectId:request.project
        });
        await newNotification.save();
        res.status(200).json({message:"Request Accepted Successfully"});
    } catch (error) {
        console.log("Error in acceptCollabRequest Controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const rejectCollabRequest=async(req,res)=>{
    try {
        const {requestId}=req.params;
        const userId=req.user._id;
        const request=await CollabRequest.findById(requestId);
        if(!request){
            return res.status(404).json({message:"Collab Request not found"});
        }
        //check if request receiver is current user
        if(request.receiver.toString()!==userId.toString()){
            return res.status(403).json({message:"You are not authorized to accept this request"});
        }

        if(request.status!=="pending"){
            return res.status(400).json({message:"Request had already been procesed"});
        }

        request.status="rejected";
        await request.save();
        const newNotification=new Notification({
            recipient:request.sender,
            relatedUser:userId,
            type:"collabRejected",
            projectId:request.project
        });
        await newNotification.save();
        res.status(200).json({message:"Request Rejected Successfully"});
    } catch (error) {
        console.log("Error in rejectCollabRequest Controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};


export const getCollabRequests=async(req,res)=>{
    try {
        const allRequests=await CollabRequest.find({receiver:req.user._id}).populate("sender","username profilePic headline").populate("project","title description").sort({createdAt:-1});
        res.status(200).json(allRequests);
    } catch (error) {
        console.log("Error in getCollabRequests controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const getCollabStatus=async(req,res)=>{
    try {
        const projectId=req.params.projectId;
        const collabReq=await CollabRequest.findOne({sender:req.user._id,project:projectId});
        if(!collabReq){
            return res.status(404).json({message:"Request not found"});
        }
        res.status(200).json({message:collabReq.status});
    } catch (error) {
        console.log("Error in getCollabStatus controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}
