import express from "express";
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notifyRoutes from "./routes/notification.route.js";
import projectRoutes from "./routes/project.route.js";
import collabRoutes from "./routes/collab.route.js";

const app=express();
const PORT=ENV.PORT || 8080;


app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth",authRoutes); //authentication routes
app.use("/api/v1/users",userRoutes); //user routes
app.use("/api/v1/posts",postRoutes); //post routes
app.use("/api/v1/notifications",notifyRoutes); //notification routes
app.use("/api/v1/project",projectRoutes);//project routes
app.use("/api/v1/collab",collabRoutes); //collab Routes


app.listen(PORT,()=>{
    console.log(`App is listening on PORT ${PORT}`);
    connectDB();
});