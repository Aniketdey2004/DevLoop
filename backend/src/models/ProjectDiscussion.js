import mongoose from "mongoose";

const projectDiscussionSchema=new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        trim:true,
        required:true
    }
},{timestamps:true});

const ProjectDiscussion=mongoose.model("ProjectDiscussion",projectDiscussionSchema);

export default ProjectDiscussion;