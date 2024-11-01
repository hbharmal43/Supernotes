import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import { File } from '../models/fileModel.js';
import path from 'path';

dotenv.config();

const router = express.Router();

// Initialize S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Multer configuration to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

// Route for file upload
router.post('/upload', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Error during file upload:", err);
            return res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
        }

        const fileContent = req.file.buffer;
        const courseNumber = req.body.courseNumber;
        const fileName = req.body.fileName || `${Date.now()}`;
        
        // Use courseNumber as folder name in the S3 Key
        const s3Key = `${courseNumber}/${fileName}${path.extname(req.file.originalname)}`; 

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: fileContent,
            ContentType: req.file.mimetype,
        };

        try {
            const command = new PutObjectCommand(params);
            await s3.send(command);

            // Save metadata in MongoDB
            const newFile = new File({
                fileName: req.body.fileName,
                description: req.body.description,
                tags: req.body.tags.split(','),
                courseNumber,
                filePath: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
            });

            await newFile.save();

            res.status(201).json({
                success: true,
                message: `File uploaded successfully for course ${courseNumber}!`,
                file: s3Key,
            });
        } catch (uploadError) {
            console.error("Error uploading file to S3:", uploadError);
            res.status(500).json({ success: false, message: 'Error uploading to S3' });
        }
    });
});

// Endpoint to get files by course number
router.get('/files', async (req, res) => {
    const { courseNumber } = req.query;
  
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `${courseNumber}/`, // Assumes each course has a folder in S3
    };
  
    try {
      // List objects in the specified course folder
      const command = new ListObjectsV2Command(params);
      const data = await s3.send(command);
  
      // Map each item to include a signed URL
      const files = await Promise.all(data.Contents.map(async (item) => ({
        fileName: item.Key.split('/').pop(),
        filePath: await getSignedUrl(s3, new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: item.Key,
        }), { expiresIn: 3600 }), // Link expires in 1 hour
      })));
  
      res.status(200).json(files);
    } catch (error) {
      console.error("Error fetching files from S3:", error);
      res.status(500).json({ error: 'Error fetching files' });
    }
  });

// Route to fetch folders (course names) from S3
router.get('/courses', async (req, res) => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delimiter: '/', // To get folders only
        };

        const command = new ListObjectsV2Command(params);
        const data = await s3.send(command);

        // Log the full response from S3
        console.log("S3 Data:", data);

        // Extract folder names if they exist
        const folderNames = data.CommonPrefixes ? data.CommonPrefixes.map((prefix) => prefix.Prefix.replace('/', '')) : [];

        console.log("Extracted Folder Names:", folderNames);

        res.status(200).json(folderNames);
    } catch (error) {
        console.error("Error fetching folders from S3:", error);
        res.status(500).json({ message: 'Error fetching course folders from S3' });
    }
});

export default router;
