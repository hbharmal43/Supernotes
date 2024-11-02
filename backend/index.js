import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import pdfRoutes from "./routes/pdfRoutes.js";  // PDF upload routes
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";  // Authentication routes
import fileRoutes from './routes/files.route.js'; // File routes for user notes

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// CORS configuration
// Enable CORS for your frontend (localhost:5173)
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Middleware to handle JSON and cookie parsing
app.use(express.json());  // Parses JSON payloads
app.use(cookieParser());  // Parses cookies

// Serve uploaded files statically from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use("/api", pdfRoutes);  // Routes for file uploads
app.use("/api/auth", authRoutes);  // Routes for authentication
app.use("/api/files", fileRoutes);  // Routes for fetching user notes

// Production configuration to serve frontend
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend")));

    // Serve the index.html file for any other routes
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
    });
}

// Start server and connect to database
app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port: ", PORT);
});

