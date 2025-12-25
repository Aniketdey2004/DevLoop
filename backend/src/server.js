import express from "express";
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";

const app=express();
const PORT=ENV.PORT || 8080;


app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth",authRoutes);


app.listen(PORT,()=>{
    console.log(`App is listening on PORt ${PORT}`);
    connectDB();
});