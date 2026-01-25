import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import { createProject, getProject, editProject, getMyProjects, getUserProjects} from "../controllers/project.controller.js";
const router=express.Router();

router.get("/",protectRoute,getMyProjects);
router.post("/create",protectRoute, createProject);
router.patch("/:id",protectRoute, editProject);
router.get("/user/:userId",protectRoute, getUserProjects);
router.get("/:id",protectRoute, getProject);


export default router;