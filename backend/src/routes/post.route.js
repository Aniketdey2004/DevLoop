import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import { getPostFeed, createPost, deletePost, getPost, createComment, likePost} from "../controllers/post.controller.js";


const router=express.Router();

router.get("/feed", protectRoute, getPostFeed);
router.post("/create",protectRoute,createPost);
router.delete("/:id",protectRoute, deletePost);
router.get("/:id",protectRoute, getPost);
router.post("/:id/comment",protectRoute,createComment);
router.post("/:id/like",protectRoute, likePost);

export default router;