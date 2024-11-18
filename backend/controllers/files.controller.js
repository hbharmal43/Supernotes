import express from "express";
import multer from "multer";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { File } from "../models/fileModel.js";
import path from "path";
import { verifyToken } from "../middleware/verifyToken.js"; // Import your token verification middleware

dotenv.config();

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to get user-specific content
export const getUserContent = async (req, res) => {
  try {
    const userFiles = await File.find({ uploadedBy: req.userId }).lean();
    console.log("User Files Fetched:", userFiles); // Log fetched files
    res.status(200).json(userFiles); // Ensure this includes _id
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ message: "Error fetching user files", error });
  }
};

// Function to handle file upload
export const uploadFile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated." });
    }

    const fileContent = req.file.buffer;
    const courseNumber = req.body.courseNumber;
    const fileName = req.body.fileName || `${Date.now()}`;

    const s3Key = `${courseNumber}/${fileName}${path.extname(
      req.file.originalname
    )}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Save metadata in MongoDB
    const newFile = new File({
      fileName: req.body.fileName,
      description: req.body.description,
      tags: req.body.tags.split(","),
      courseNumber,
      filePath: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`, // Ensure this is an S3 URL
      uploadedBy: userId,
    });

    await newFile.save();
    console.log("New file saved:", newFile); // Debug log

    res.status(201).json({
      success: true,
      message: `File uploaded successfully for course ${courseNumber}!`,
      file: s3Key,
    });
  } catch (uploadError) {
    console.error("Error uploading file:", uploadError);
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
};

// Function to delete a file uploaded by the user
export const deleteFile = async (req, res) => {
  try {
    const userId = req.userId;
    const fileId = req.params.id;

    // Find the file by ID and ensure it belongs to the authenticated user
    const file = await File.findOne({ _id: fileId, uploadedBy: userId });

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found or unauthorized." });
    }

    // Delete the file from S3
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.filePath,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

    // Delete the file record from the database
    await file.remove();

    res
      .status(200)
      .json({ success: true, message: "File deleted successfully." });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ success: false, message: "Error deleting file" });
  }
};

// Function to add a rating to a file
export const addRating = async (req, res) => {
  console.log("Received request to add rating:", req.body); // Debug log
  const { fileId, rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid rating value." });
  }

  try {
    const file = await File.findById(fileId);

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found." });
    }

    file.ratings.push(rating);
    await file.save();

    const totalRatings = file.ratings.length;
    const averageRating =
      file.ratings.reduce((sum, value) => sum + value, 0) / totalRatings;

    res.status(200).json({
      success: true,
      message: "Rating added successfully.",
      averageRating,
      totalRatings,
    });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ success: false, message: "Error adding rating." });
  }
};

// Function to get the average rating and total number of reviews
export const getRatings = async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await File.findById(fileId);

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found." });
    }

    const totalRatings = file.ratings.length;
    const averageRating = totalRatings
      ? file.ratings.reduce((sum, value) => sum + value, 0) / totalRatings
      : 0;

    res.status(200).json({ averageRating, totalRatings });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching ratings." });
  }
};
