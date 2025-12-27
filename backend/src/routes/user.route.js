import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import { getSuggestedAccounts, getPublicProfile, updateProfile, followUser, unfollowUser, getFollowers, getFollowing } from "../controllers/user.controller.js";
const router=express.Router();

router.get("/suggestions",protectRoute,getSuggestedAccounts);
router.get("/:username",protectRoute,getPublicProfile);
router.patch("/updateProfile", protectRoute, updateProfile);
router.post("/:id/follow",protectRoute,followUser);
router.post("/:id/unfollow",protectRoute,unfollowUser);
router.get("/followers",protectRoute,getFollowers);
router.get("/following",protectRoute,getFollowing);

export default router;