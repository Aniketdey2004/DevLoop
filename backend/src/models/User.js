import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
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
    bio:{
        type:String,
        default:"Hey, I am using DevLoop"
    },
    githubUrl:String,
    skills:[String],
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
    connections:[
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