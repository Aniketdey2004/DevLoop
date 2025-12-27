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
    role:String,
    status:{
        type:String,
        enum:["pending","accepted","rejected"]
    }
});

const CollabRequest=mongoose.model("CollabRequest",collabRequestSchema);
export default CollabRequest;