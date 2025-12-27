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
        enum:["like","comment","follow","collabAccepted","collabRequest"]
    },
    relatedPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    read:{
        type:Boolean,
        default:false
    },
    requestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CollabRequest"
    }
},{
    timestamps:true
});

const Notification=mongoose.model("Notification",notificationSchema);

export default Notification;