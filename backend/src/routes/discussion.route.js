import express from "express";
const router=express.Router();
import {protectRoute} from "../middlewares/auth.middleware.js";
import { isProjectCollaborator } from "../middlewares/discussion.middleware.js";
import { createProjectDiscussion, getProjectDiscussions } from "../controllers/discussion.controller.js";

router.get("/:projectId",protectRoute,isProjectCollaborator,getProjectDiscussions);
router.post("/:projectId",protectRoute, isProjectCollaborator, createProjectDiscussion);

export default router;