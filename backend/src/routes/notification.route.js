import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getAllNotifications, markNotificationAsRead, deleteNotification } from "../controllers/notification.controlller.js";

const router=express.Router();

router.get("/",protectRoute,getAllNotifications);
router.patch("/:id",protectRoute,markNotificationAsRead);
router.delete("/:id",protectRoute,deleteNotification);

export default router;