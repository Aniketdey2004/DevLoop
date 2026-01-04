import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    googleId:String,
    password:{
        type:String,
    },
    profilePic:{
        type:String,
        default:""
    },
    bannerImg:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    about:{
        type:String,
        default:""
    },
    headline:{
        type:String,
        default:"Hey! I am using DevLoop"
    },
    githubUrl:String,
    skills:{
        type:[String],
        default:[]
    },
    experience:[
        {
            title:String,
            company:String,
            startDate:Date,
            endDate:Date,
            description:String
        }
    ],
    education:[
        {
            school:String,
            Degree:String,
            fieldOfStudy:String,
            startDate:Date,
            endDate:Date,
            Grade:String
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    projects:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
        }
    ]
},{timestamps:true});

const User=mongoose.model("User", userSchema);

export default User;