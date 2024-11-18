import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getUserContent,
  uploadFile,
  deleteFile,
  addRating,
  getRatings,
} from "../controllers/files.controller.js";

const router = express.Router();

// Route to get files uploaded by the authenticated user
router.get("/my-content", verifyToken, getUserContent);

// Route for file upload
router.post("/upload", verifyToken, uploadFile);

// Route for deleting a user's file
router.delete("/:id", verifyToken, deleteFile);

// Route to add a rating
router.post("/rate", addRating);

// Route to fetch ratings for a file
router.get("/:fileId/ratings", getRatings);

export default router;
