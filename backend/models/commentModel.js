const mongoose = require('mongoose');

// Assuming you have a File model that represents the files or notes
const commentSchema = new mongoose.Schema({
  commentID: {
    type: String,  // Unique identifier for each comment
    required: true,
    unique: true,  // Ensures that each comment has a unique ID
  },
  content: {
    type: String,
    required: true,  // Content of the comment
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the user who made the comment
    ref: 'User',  
    required: true,
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the file or note the comment belongs to
    ref: 'File',  // Adjust this if you're using a different model for files or notes
    required: true,  
  },
  timestamp: {
    type: Date,
    default: Date.now,  
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

