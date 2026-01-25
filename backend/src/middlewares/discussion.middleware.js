import Project from "../models/Project.js";
export const isProjectCollaborator=async(req,res,next)=>{
    try {
        const projectId=req.params.projectId;
        const project=await Project.findById(projectId);
        if(!project.collaborators.includes(req.user._id))
        {
            return res.status(403).json({message:"You are not a collaborator of this project"});
        }
        next();
    } catch (error) {
        console.log("Error in isProjectCollaborator checking middleware", error);
        res.status(500).json({message:"Interal Server Error"});
    }
};