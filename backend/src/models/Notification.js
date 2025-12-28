import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    relatedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:["like","comment","follow","collabAccepted","collabRejected"]
    },
    relatedPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    read:{
        type:Boolean,
        default:false
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    }
},{
    timestamps:true
});

const Notification=mongoose.model("Notification",notificationSchema);

export default Notification;