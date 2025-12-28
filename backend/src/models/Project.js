import mongoose from "mongoose";
import CollabRequest from "./CollabRequest.js";
import Post from "./Post.js";
const projectSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    techStack:[String],
    githubRepo:{
        type:String,
        required:true
    },
    liveUrl:String,
    collaborators:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    status:{
        type:String,
        enum:["active","completed"]
    },
    requireCollaborators:{
        type:Boolean
    }
});

//mongoose middleware for cleanup after project is deleted
projectSchema.post("findOneAndDelete",async (project)=>{
    if(project){
        await CollabRequest.deleteMany({project:project._id});
        await Post.findOneAndDelete({project:project._id}); //post when deleted will trigger its respective middleware which will clear its notifications
    }
}); 
const Project=mongoose.model("Project",projectSchema);



export default Project;