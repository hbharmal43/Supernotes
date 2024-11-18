import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
  {/* userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },*/}
  userId: { type: String, required: true }, // Allow String to support 'anonymous'
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.model('Comment', commentSchema);

