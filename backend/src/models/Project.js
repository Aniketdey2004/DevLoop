import mongoose from "mongoose";
import CollabRequest from "./CollabRequest";
import Post from "./Post";
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
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    collaborators:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    openRoles:[String],
    status:{
        type:String,
        enum:["active","completed"]
    },
    requireCollaborators:{
        type:Boolean
    }
});


projectSchema.post("findOneAndDelete",async (project)=>{
    if(project){
        await CollabRequest.deleteMany({project:project._id});
        await Post.findOneAndDelete({project:project._id});
    }
}); 
const Project=mongoose.model("Project",projectSchema);



export default Project;