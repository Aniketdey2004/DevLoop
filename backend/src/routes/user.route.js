import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import { getSuggestedAccounts, getPublicProfile, updateProfile, followUser, unfollowUser, getFollowers, getFollowing } from "../controllers/user.controller.js";
const router=express.Router();

router.get("/suggestions",protectRoute,getSuggestedAccounts);
router.get("/followers",protectRoute, getFollowers);
router.patch("/updateProfile", protectRoute, updateProfile);
router.get("/following",protectRoute,getFollowing);
router.get("/:email",protectRoute,getPublicProfile);//todo:needs to change
router.post("/:id/follow",protectRoute,followUser);
router.post("/:id/unfollow",protectRoute,unfollowUser);



export default router;