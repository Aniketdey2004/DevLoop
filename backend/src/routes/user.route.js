import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import { getSuggestedAccounts, getPublicProfile, updateProfile, followUser, unfollowUser, getFollowers, getFollowing , getSearchedUsers} from "../controllers/user.controller.js";
const router=express.Router();

router.get("/suggestions",protectRoute,getSuggestedAccounts);
router.get("/followers",protectRoute, getFollowers);
router.patch("/update", protectRoute, updateProfile);
router.get("/following",protectRoute,getFollowing);

router.get("/:id",protectRoute,getPublicProfile);//todo:needs to change
router.get("/search/:username",protectRoute,getSearchedUsers);
router.post("/:id/follow",protectRoute,followUser);
router.post("/:id/unfollow",protectRoute,unfollowUser);



export default router;