import CollabRequest from "../models/CollabRequest.js";
import Project from "../models/Project.js";

import Notification from "../models/Notification.js";
import { decrypt, inviteToRepo } from "../lib/utils.js";

export const sendCollabRequest = async (req, res) => {
  try {
    if (!req.user.github?.id) {
      return res
        .status(403)
        .json({ message: "Link your github account to send collaboration requests" });
    }
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project does not exist" });
    }
    if (project.ownerId.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot send a collab request to yourself" });
    }
    if(project.type==='portfolio'){
      return res.status(400).json({message:"You cannot send collaboration request for a portfolio project"});
    }
    if (project.collaborators.includes(req.user._id)) {
      return res
        .status(409)
        .json({ message: "You are already a collaborator" });
    }

    const existingRequest = await CollabRequest.exists({
      sender: req.user._id,
      receiver: project.ownerId,
      status: "pending",
      project:projectId
    });
    if (existingRequest) {
      return res
        .status(409)
        .json({ message: "You have already sent a request" });
    }
    const rejectedRequest = await CollabRequest.exists({
      sender: req.user._id,
      receiver: project.ownerId,
      status: "rejected",
      project:projectId
    });
    if (rejectedRequest) {
      return res
        .status(400)
        .json({ message: "You request have been  already rejected" });
    }
    const newRequest = new CollabRequest({
      sender: req.user._id,
      receiver: project.ownerId,
      status: "pending",
      project: projectId,
    });
    await newRequest.save();
    res.status(201).json({ message: "Collaboration request sent successfully" });
  } catch (error) {
    console.log("Error in sendCollabRequest controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptCollabRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;
    const request = await CollabRequest.findById(requestId)
      .populate("project", "githubRepo")
      .populate("sender", "github");
    if (!request) {
      return res.status(404).json({ message: "Collaboration Request not found" });
    }
    //check if request receiver is current user
    if (request.receiver.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Request had already been procesed" });
    }

    request.status = "accepted";
    const token = decrypt(req.user.github.accessToken);
    console.log(token)
    await inviteToRepo({
      repoOwner:request.project.githubRepo.repoOwner,
      repoName:request.project.githubRepo.repoName,
      githubUsername: request.sender.github.username,
      ownerAccessToken: token,
    });

    await request.save();

    await Project.findByIdAndUpdate(request.project._id, {
      $push: { collaborators: request.sender._id },
    });

    const newNotification = new Notification({
      recipient: request.sender._id,
      relatedUser: userId,
      type: "collabAccepted",
      projectId: request.project._id,
    });
    await newNotification.save();
    res.status(200).json({ message: "Request Accepted Successfully" });
  } catch (error) {
    console.log("Error in acceptCollabRequest Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const rejectCollabRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;
    const request = await CollabRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Collaboration Request not found" });
    }
    //check if request receiver is current user
    if (request.receiver.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Request had already been procesed" });
    }

    request.status = "rejected";
    await request.save();
    const newNotification = new Notification({
      recipient: request.sender,
      relatedUser: userId,
      type: "collabRejected",
      projectId: request.project,
    });
    await newNotification.save();
    res.status(200).json({ message: "Request Rejected Successfully" });
  } catch (error) {
    console.log("Error in rejectCollabRequest Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCollabRequests = async (req, res) => {
  try {
    const allRequests = await CollabRequest.find({ receiver: req.user._id, status:"pending" })
      .populate("sender", "username profilePic headline")
      .populate("project", "title")
      .sort({ createdAt: -1 });
    res.status(200).json(allRequests);
  } catch (error) {
    console.log("Error in getCollabRequests controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCollabStatus = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const collabReq = await CollabRequest.findOne({
      sender: req.user._id,
      project: projectId,
    });
    if (!collabReq) {
      return res.status(200).json({ message: "Not send" });
    }
    res.status(200).json({ message: collabReq.status });
  } catch (error) {
    console.log("Error in getCollabStatus controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
