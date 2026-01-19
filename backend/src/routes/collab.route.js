import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import { sendCollabRequest, acceptCollabRequest, rejectCollabRequest, getCollabRequests, getCollabStatus } from "../controllers/collab.controller.js";

const router=express.Router();

router.post("/request/:projectId",protectRoute, sendCollabRequest);
router.patch("/accept/:requestId",protectRoute, acceptCollabRequest);
router.patch("/reject/:requestId",protectRoute, rejectCollabRequest);
//get all collab request for the current user
router.get("/requests",protectRoute, getCollabRequests);
//get collab request status
router.get("/status/:projectId",protectRoute,getCollabStatus);

export default router;