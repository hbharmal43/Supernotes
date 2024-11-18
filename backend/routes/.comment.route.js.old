import express from 'express';
import { Comment } from '../models/commentModel.js'; // Import the Comment model
import { verifyToken } from '../middleware/verifyToken.js'; // Import your token verification middleware

const router = express.Router();

// Route to add a new comment to a file
router.post('/add', verifyToken, async (req, res) => {
    const { fileId, commentText } = req.body;

    // Validate input
    if (!fileId || !commentText) {
        return res.status(400).json({ message: "File ID and comment text are required." });
    }

    try {
        console.log("Received fileId:", fileId); // Log the received fileId
        console.log("Received commentText:", commentText); // Log the received commentText

        // Create a new comment and link it to the file and the user
        const comment = new Comment({
            commentID: `comment-${Date.now()}`, // Generate a unique ID based on timestamp
            content: commentText, // The content of the comment
            userId: req.userId,  // The user who is adding the comment
            fileId,              // The file the comment is linked to
        });

        await comment.save();

        res.status(201).json({
            message: 'Comment added successfully',
            comment,
        });
    } catch (error) {
        console.error('Error adding comment:', error); // Log error message
        res.status(500).json({ message: 'Failed to add comment.' });
    }
});

// Route to get all comments for a specific file
router.get('/:fileId', async (req, res) => {
    const { fileId } = req.params;

    try {
        // Find comments for the given file
        const comments = await Comment.find({ fileId }) // Filter by fileId
            .populate('userId', 'name email'); // Optionally populate user info

        res.status(200).json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error); // Log error
        res.status(500).json({ message: 'Failed to fetch comments.' });
    }
});

// Route to delete a comment (only for the user who posted it or an admin)
router.delete('/:commentId', verifyToken, async (req, res) => {
    const { commentId } = req.params;

    try {
        // Find the comment by ID
        const comment = await Comment.findById(commentId);

        // Check if the comment exists and if the user is allowed to delete it
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // Ensure the user is either the owner of the comment or an admin
        if (comment.userId.toString() !== req.userId && !req.isAdmin) { // Assuming req.isAdmin is set based on user role
            return res.status(403).json({ message: 'Unauthorized to delete this comment.' });
        }

        await comment.remove();

        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting comment:', error); // Log error
        res.status(500).json({ message: 'Failed to delete comment.' });
    }
});

export default router;

