import express from "express";
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notifyRoutes from "./routes/notification.route.js";

const app=express();
const PORT=ENV.PORT || 8080;


app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/posts",postRoutes);
app.use("/api/v1/notifications",notifyRoutes);


app.listen(PORT,()=>{
    console.log(`App is listening on PORT ${PORT}`);
    connectDB();
});