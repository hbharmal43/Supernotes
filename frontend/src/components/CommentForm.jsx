import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore"; // Import auth store to get user info

const CommentForm = ({ fileId }) => {
  const { user } = useAuthStore(); // Get the user data from your auth store
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // Track errors to show a user-friendly message

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const userId = user ? user._id : "anonymous"; // Use 'anonymous' if user is not authenticated

    if (!comment.trim()) {
      alert("Please enter a comment before submitting.");
      return;
    }

    if (!fileId) {
      alert("fileId is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null); // Reset error state before each submission

    try {
      await axios.post("http://localhost:5001/api/comments", {
        fileId,
        userId, // Will either be the user ID or 'anonymous'
        text: comment,
      });

      alert("Comment posted successfully!");
      setComment(""); // Clear the comment input
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("There was an error posting your comment. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md max-w-2xl mx-auto">
      {" "}
      {/* Updated width classes */}
      <form onSubmit={handleCommentSubmit}>
        <label htmlFor="comment" className="sr-only">
          Comment
        </label>{" "}
        {/* For better accessibility */}
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          required
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
        {/* Display error message if there's an error */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
