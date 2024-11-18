import React, { useState } from "react";
import axios from "axios";

const CommentOverlay = ({ fileId, onClose }) => {
  const [commentText, setCommentText] = useState("");

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      console.log("Submitting comment:", { fileId, commentText }); // Log the data being sent
      const response = await axios.post(
        "http://localhost:5000/api/comments/add",
        { fileId, commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response from server:", response.data); // Log server response
      alert("Comment added successfully.");
      onClose(); // Close the overlay after successful submission
      setCommentText(""); // Reset comment text
    } catch (error) {
      console.error("Error posting comment:", error); // Log the error object
      console.error(
        "Error details:",
        error.response ? error.response.data : "No response data"
      ); // Log the error response from the server
      alert("Failed to post comment. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows="6"
          placeholder="Write your comment here..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose} // Close overlay when cancel button is clicked
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitComment} // Submit comment when clicked
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentOverlay;
