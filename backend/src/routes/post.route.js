import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js";
import { getPostFeed, createPost, deletePost, getPost, createComment, likePost} from "../controllers/post.controller.js";


const router=express.Router();

router.get("/feed", protectRoute, getPostFeed);//ok
router.post("/create",protectRoute,createPost);//ok
router.delete("/:id",protectRoute, deletePost);
router.get("/:id",protectRoute, getPost);//ok
router.post("/:id/comment",protectRoute,createComment);//ok
router.post("/:id/like",protectRoute, likePost);

export default router;