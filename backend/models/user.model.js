import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,

		// Add a field for file references
		uploadedFiles: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'File',  // This refers to the File model we'll use to store file metadata
		}],
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
