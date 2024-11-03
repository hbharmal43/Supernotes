import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import path from 'path';
import { File } from '../models/fileModel.js';

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
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated.' });
        }

        // Fetch files uploaded by this user from the database
        const userFiles = await File.find({ uploadedBy: userId });

        if (!userFiles.length) {
            return res.status(404).json({ success: false, message: 'No files found for this user.' });
        }

        // Map each item to include a signed URL
        const files = await Promise.all(userFiles.map(async (file) => ({
            fileName: file.fileName,
            filePath: await getSignedUrl(s3, new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: file.filePath,
            }), { expiresIn: 3600 }), // Link expires in 1 hour
            description: file.description,
            tags: file.tags,
        })));

        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching user files:', error);
        res.status(500).json({ success: false, message: 'Error fetching user files' });
    }
};

// Function to handle file upload
export const uploadFile = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated.' });
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

        const command = new PutObjectCommand(params);
        await s3.send(command);

        // Save metadata in MongoDB
        const newFile = new File({
            fileName: req.body.fileName,
            description: req.body.description,
            tags: req.body.tags.split(','),
            courseNumber,
            filePath: s3Key,
            uploadedBy: userId,
        });

        await newFile.save();

        res.status(201).json({
            success: true,
            message: `File uploaded successfully for course ${courseNumber}!`,
            file: s3Key,
        });
    } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        res.status(500).json({ success: false, message: 'Error uploading file' });
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
            return res.status(404).json({ success: false, message: 'File not found or unauthorized.' });
        }

        // Delete the file from S3
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.filePath,
        };

        await s3.send(new DeleteObjectCommand(deleteParams));

        // Delete the file record from the database
        await file.remove();

        res.status(200).json({ success: true, message: 'File deleted successfully.' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ success: false, message: 'Error deleting file' });
    }
};

