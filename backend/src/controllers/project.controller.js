import Post from "../models/Post.js";
import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      techStack,
      githubRepo,
      liveUrl,
      status,
      requireCollaborators,
    } = req.body;
    if (
      !title?.trim() ||
      !description?.trim() ||
      (status !== "active" && status !== "completed") ||
      requireCollaborators === undefined ||
      !githubRepo?.trim() ||
      !Array.isArray(techStack) ||
      techStack.length === 0 
    ) {
      return res
        .status(400)
        .json({ message: "All field of project are required and should be valid" });
    }
    if (requireCollaborators === true && status === "completed") {
      return res
        .status(400)
        .json({
          message: "You cannot invite collaborators for a completed project",
        });
    }

    const newProject = new Project({
      title,
      description,
      techStack,
      githubRepo,
      liveUrl: liveUrl?.trim() || "",
      status,
      requireCollaborators,
    });

    await newProject.save();

    if (requireCollaborators === true) {
      const newPost = new Post({
        author: req.user._id,
        content: "Looking for collaborators to build this project 🚀",
        type: "collab",
        project: newProject._id,
      });
      await newPost.save();
    }
    res.status(201).json({ message: "Project created" });
  } catch (error) {
    console.log("Error in createProject controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProject=async(req,res)=>{
    const projectId=req.params.id;
    try {
        const project=await Project.exists({_id:projectId});
        if(!project){
            return res.status(404).json({message:"Project does not exist"});
        }
        if(!req.user.projects.includes(projectId)){
            return res.status(403).json({message:"You are not the owner"});
        }
        else{
            await Project.findByIdAndDelete(projectId);
        }
        res.status(200).json({message:"Project successfully deleted"});
    } catch (error) {
        console.log("Error in deleteProject Controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const editProject=async(req,res)=>{
    const projectId=req.params.id;
    try {
        const project=await Project.exists({_id:projectId});
        if(!project){
          return res.status(404).json({messsage:"Project does not exist"});
        }
        if(!req.user.projects.includes(projectId)){
          return res.status(403).json({message:"You are not authorized"});
        }
        const allowedFields=[
          "title",
          "description",
          "techStack",
          "githubRepo",
          "liveUrl",
          "status",
          "requireCollaborators"
        ];
        const updatedBody={};
        for(const field of allowedFields){
          if(req.body[field]!==undefined){
            updatedBody[field]=req.body[field];
          }
        }
        const updatedProject=await Project.findByIdAndUpdate(projectId,{$set:{updatedBody}},{new:true});
        res.status(200).json({message:"Project successfully updated"});
    } catch (error) {
        console.log("Error in editProject Controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const getProject=async(req,res)=>{
  const projectId=req.params.id;
  try {
    const project=await Project.findById(projectId).populate("collaborators","name username profilePic headline");
    if(!project)
    {
      return res.status(404).json({message:"No such project exists"});
    }
    res.status(200).json(project);
  } catch (error) {
    console.log("Error in getProject controller",error);
    res.status(500).json({message:"Internal Server Error"});
  }
};