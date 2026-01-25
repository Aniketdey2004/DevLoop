import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notifyRoutes from "./routes/notification.route.js";
import projectRoutes from "./routes/project.route.js";
import collabRoutes from "./routes/collab.route.js";
import discussionRoutes from './routes/discussion.route.js';

const app=express();
const PORT=ENV.PORT || 5000;
const __dirname = path.resolve();

if(ENV.NODE_ENV!=='production'){
    app.use(cors({origin:ENV.FRONTEND_URL, credentials:true}));
}

app.use(express.json({limit:"10mb"}));
app.use(cookieParser());
app.use("/api/v1/auth",authRoutes); //authentication routes
app.use("/api/v1/users",userRoutes); //user routes
app.use("/api/v1/posts",postRoutes); //post routes
app.use("/api/v1/notifications",notifyRoutes); //notification routes
app.use("/api/v1/projects",projectRoutes);//project routes
app.use("/api/v1/collab",collabRoutes); //collab Routes
app.use("/api/v1/discussions",discussionRoutes);//discussion routes 

if(ENV.NODE_ENV === "production")
{
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    
    app.use((req, res) => {
        res.sendFile(path.resolve(__dirname,"../frontend","dist","index.html"));
    });
}
app.listen(PORT,()=>{
    console.log(`App is listening on PORT ${PORT}`);
    connectDB();
});