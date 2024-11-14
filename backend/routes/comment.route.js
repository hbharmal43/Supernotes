import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import { Comment } from '../models/commentModel.js'; // Import Comment model
import { File } from '../models/fileModel.js'; // Import File model
import { verifyToken } from '../middleware/verifyToken.js';

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

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file'); // This will store files in memory

// Route to add a comment
router.post('/add', verifyToken, async (req, res) => {
    const { fileId, fileName, commentText } = req.body;

    // Validate the input
    if (!commentText) {
        return res.status(400).json({ message: 'Comment text is required.' });
    }
    if (!fileId && !fileName) {
        return res.status(400).json({ message: 'File ID or File Name is required.' });
    }

    try {
        let file;

        // Find the file by fileId or fileName
        if (fileId) {
            file = await File.findById(fileId); // Use fileId to find the file
        } else if (fileName) {
            file = await File.findOne({ fileName }); // Use fileName to find the file
        }

        if (!file) {
            return res.status(404).json({ message: 'File not found.' });
        }

        // Create a new comment and associate it with the file
        const newComment = new Comment({
            fileId: file._id, // Store file's MongoDB _id in the comment
            fileName: file.fileName, // Optionally, store fileName too
            commentText,
            createdAt: new Date(),
        });

        await newComment.save();

        // Optionally, you could also add the comment to the File's comment array
        file.comments.push(newComment._id);
        await file.save();

        res.status(201).json({ message: 'Comment added successfully' });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ message: 'Error adding comment', error: err.message });
    }
});

// Route to fetch comments for a file
router.get('/:fileId', async (req, res) => {
    const { fileId } = req.params;

    try {
        // Find the file and populate its comments
        const file = await File.findById(fileId).populate('comments');
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.status(200).json({ comments: file.comments });
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
});

// Route to upload file (if you're storing metadata or related file information to S3)
router.post('/upload', verifyToken, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Error during file upload:", err);
            return res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
        }

        // Ensure the user is authenticated
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const fileContent = req.file.buffer;
        const courseNumber = req.body.courseNumber;
        const fileName = req.body.fileName || `${Date.now()}`;
        const s3Key = `${courseNumber}/${fileName}${path.extname(req.file.originalname)}`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: fileContent,
            ContentType: req.file.mimetype,
        };

        try {
            // Upload to S3
            const command = new PutObjectCommand(params);
            await s3.send(command);

            // Save file metadata in MongoDB
            const newFile = new File({
                fileName: req.body.fileName,
                description: req.body.description,
                tags: req.body.tags.split(','),
                courseNumber,
                filePath: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
                uploadedBy: userId,
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

// Endpoint to get files (similar to how you handle fetching files for a course)
router.get('/files', async (req, res) => {
    const { courseNumber } = req.query;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: `${courseNumber}/`,
    };

    try {
        const command = new ListObjectsV2Command(params);
        const data = await s3.send(command);

        const files = await Promise.all(data.Contents.map(async (item) => ({
            fileName: item.Key.split('/').pop(),
            filePath: await getSignedUrl(s3, new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: item.Key,
            }), { expiresIn: 3600 }),
        })));

        res.status(200).json(files);
    } catch (error) {
        console.error("Error fetching files from S3:", error);
        res.status(500).json({ error: 'Error fetching files' });
    }
});

// Route to fetch courses from S3
router.get('/courses', async (req, res) => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delimiter: '/',
        };

        const command = new ListObjectsV2Command(params);
        const data = await s3.send(command);

        const folderNames = data.CommonPrefixes ? data.CommonPrefixes.map((prefix) => prefix.Prefix.replace('/', '')) : [];

        res.status(200).json(folderNames);
    } catch (error) {
        console.error("Error fetching folders from S3:", error);
        res.status(500).json({ message: 'Error fetching course folders from S3' });
    }
});

export default router;

