import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { File } from '../models/fileModel.js'; // Assuming you have a file model

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage engine for multer to save files in the main uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const fileName = req.body.fileName || Date.now();
    cb(null, fileName + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('file');

router.post('/upload', async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
      }
  
      try {
        // Create a new file document with metadata and save it to MongoDB
        const newFile = new File({
          fileName: req.body.fileName,
          description: req.body.description,
          tags: req.body.tags.split(','),
          courseNumber: req.body.courseNumber,
          filePath: req.file.path, // Save the path of the file
        });
  
        await newFile.save(); // Save the file metadata
  
        res.status(201).json({
          success: true,
          message: `File uploaded successfully as ${req.body.fileName}!`,
          file: req.file.filename,
        });
      } catch (error) {
        console.error("Error saving file metadata:", error);
        res.status(500).json({ success: false, message: 'Error saving file metadata' });
      }
    });
  });
  
export default router;
