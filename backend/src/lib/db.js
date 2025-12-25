import mongoose from "mongoose";
import { ENV } from "./env.js";


export const connectDB=async()=>{
    try{
        const {MONGO_URI}=ENV;
        if(!MONGO_URI){
            throw new Error("MONGO_URI is not set");
        }
        const conn=await mongoose.connect(MONGO_URI);
        console.log(`MONGODB connected: ${conn.connection.host}`);
    }
    catch(error){
        console.log("error occured in connecting to DB", error);
        process.exit(1);        
    }
};