import { File } from '../models/fileModel.js';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Fetch the user's uploaded files or notes
export const getUserContent = async (req, res) => {
  try {
    const userId = req.userId; // Directly use req.userId set by verifyToken middleware
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }

    // Fetch content uploaded by the authenticated user
    const content = await File.find({ uploadedBy: userId });
    console.log(`Fetched content from DB:`, content); // Debugging

    // Generate signed URLs for the fetched content
    const contentWithUrls = await Promise.all(content.map(async (item) => {
      try {
        const signedUrl = await getSignedUrl(s3, new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: item.filePath, // Use filePath directly
        }), { expiresIn: 3600 });

        return { ...item._doc, filePath: signedUrl }; // Return the item with the signed URL
      } catch (err) {
        console.error('Error generating signed URL:', err); // Debugging
        return null; // Return null if URL generation fails
      }
    }));

    // Filter out any null entries (in case of URL generation failures)
    const validContent = contentWithUrls.filter(item => item !== null);

    // Respond with the valid content
    res.status(200).json({ success: true, files: validContent }); // Changed to files for clarity
  } catch (err) {
    console.error(`Error retrieving content:`, err);
    res.status(500).json({ success: false, message: 'Failed to retrieve content.' });
  }
};

// Upload file function
export const uploadFile = async (req, res) => {
  try {
    const userId = req.userId; // Retrieve user ID from the request
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }

    const { originalname, mimetype, size } = req.file;

    // Create a new file entry in the database
    const newFile = new File({
      fileName: originalname,
      fileType: mimetype,
      fileSize: size,
      uploadedBy: userId, // Set the uploadedBy field
      filePath: `uploads/${originalname}`, // Set a path for the uploaded file
    });

    await newFile.save(); // Save the file entry in the database

    // Upload the file to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: newFile.filePath,
      Body: req.file.buffer,
      ContentType: mimetype,
    });

    await s3.send(command);

    res.status(200).json({ success: true, file: newFile });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Failed to upload file.' });
  }
};

