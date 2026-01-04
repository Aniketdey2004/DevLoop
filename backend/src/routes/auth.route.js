import express from"express";
const router=express.Router();
import { signup , login, logout, getCurrentUser, loginThroughGmail} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.post("/google",loginThroughGmail);
router.get("/me",protectRoute,getCurrentUser);

export default router;