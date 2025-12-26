import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import { getSuggestedAccounts, getPublicProfile, updateProfile } from "../controllers/user.controller.js";
const router=express.Router();

router.get("/suggestions",protectRoute,getSuggestedAccounts);
router.get("/:username",protectRoute,getPublicProfile);
router.patch("/updateProfile", protectRoute, updateProfile);

export default router;