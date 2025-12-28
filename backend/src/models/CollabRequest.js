import mongoose from "mongoose";

const collabRequestSchema=new mongoose.Schema({
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"]
    }
},{timestamps:true});

const CollabRequest=mongoose.model("CollabRequest",collabRequestSchema);
export default CollabRequest;