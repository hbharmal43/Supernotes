import express from "express";
import {
	login,
	logout,
	signup,
	forgotPassword,
	resetPassword,
	checkAuth,
} from "../controllers/auth.controller.js";

const router = express.Router();

// No need for verifyToken middleware or verifyEmail route
router.get("/check-auth", checkAuth); // This will just respond if the server is up

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Optional: Remove if password reset is not needed
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
