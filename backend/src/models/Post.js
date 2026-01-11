import mongoose from "mongoose";
import Notification from "./Notification.js";

const postSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:String,
    image:String,
    type:{
        type:String,
        enum:["Engage","Help","collab"]
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:[
        {
            content:String,
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            createdAt:{type:Date, default:Date.now}
        }
    ],
    project:{
        type:mongoose.Schema.Types.ObjectId, //if collab related post
        ref:"Project"
    }
},
{timestamps:true});

postSchema.post("findOneAndDelete",async(post)=>{
    if(post){
        await Notification.deleteMany({relatedPost:post._id});
    }
})

const Post=mongoose.model("Post",postSchema);

export default Post;