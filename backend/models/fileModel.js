import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  description: String,
  tags: [String],
  courseNumber: String,
  filePath: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model, if needed in the future
    required: false, // Make it optional
  },
}, { timestamps: true });

export const File = mongoose.model('File', fileSchema);
