import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import { createProject , deleteProject, getProject, editProject} from "../controllers/project.controller.js";
const router=express.Router();

router.post("/create",protectRoute, createProject);
router.delete("/:id",protectRoute, deleteProject);
router.patch("/:id",protectRoute, editProject);
router.get("/:id",protectRoute, getProject);

export default router;