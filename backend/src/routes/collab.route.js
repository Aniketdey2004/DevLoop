import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import { sendCollabRequest, acceptCollabRequest, rejectCollabRequest, getCollabRequests } from "../controllers/collab.controller.js";

const router=express.Router();

router.post("/request/:ownerId/:projectId",protectRoute, sendCollabRequest);
router.patch("/accept/:requestId",protectRoute, acceptCollabRequest);
router.patch("/reject/:requestId",protectRoute, rejectCollabRequest);
router.get("/requests",protectRoute, getCollabRequests);

export default router;