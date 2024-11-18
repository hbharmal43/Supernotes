import express from 'express';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
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

// Function to fetch comments from S3 for a given fileId
const getCommentsFromS3 = async (fileId) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `comments/${fileId}.json`, // Store comments for each fileId in a separate JSON file
    };

    try {
        const command = new GetObjectCommand(params);
        const data = await s3.send(command);
        const streamToString = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
                stream.on('error', reject);
            });
        const fileContent = await streamToString(data.Body);
        return JSON.parse(fileContent || '[]'); // Return parsed JSON or an empty array if no comments exist
    } catch (error) {
        console.error('Error fetching comments from S3:', error);
        return []; // Return an empty array if there is an error or file doesn't exist
    }
};

// Function to save comments to S3
const saveCommentsToS3 = async (fileId, comments) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `comments/${fileId}.json`,
        Body: JSON.stringify(comments),
        ContentType: 'application/json',
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
    } catch (error) {
        console.error('Error saving comments to S3:', error);
        throw new Error('Failed to save comments to S3');
    }
};

// Route to fetch comments for a file
router.get('/:fileId', async (req, res) => {
    const { fileId } = req.params;
    
    if (!fileId) {
        return res.status(400).json({ error: 'fileId is required' });
    }

    try {
        const comments = await getCommentsFromS3(fileId);
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Route to post a new comment
router.post('/', verifyToken, async (req, res) => {
    const { fileId, text } = req.body;
    
    // Use 'anonymous' if no userId is available
    const userId = req.userId || 'anonymous'; 

    if (!fileId || !text) {
        return res.status(400).json({ error: 'fileId and text are required' });
    }

    try {
        // Get existing comments from S3
        const comments = await getCommentsFromS3(fileId);

        // Create new comment object
        const newComment = {
            userId,
            text,
            createdAt: new Date().toISOString(),
        };

        // Add the new comment to the comments array
        comments.push(newComment);

        // Save updated comments back to S3
        await saveCommentsToS3(fileId, comments);

        res.status(201).json({ success: true, message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ error: 'Failed to post comment' });
    }
});

export default router;

