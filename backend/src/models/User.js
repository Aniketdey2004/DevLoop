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
        default:"Earth"
    },
    about:{
        type:String,
        default:""
    },
    headline:{
        type:String,
        default:"Hey! I am using DevLoop"
    },
    github: {
        id: Number,
        username: String,
        profileUrl: String,
        accessToken: String, // ENCRYPTED
        connectedAt: Date
    },
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
            description:String,
        }
    ],
    education:[
        {
            school:String,
            Degree:String,
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
    ]
},{timestamps:true});

const User=mongoose.model("User", userSchema);

export default User;