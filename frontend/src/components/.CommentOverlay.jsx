import React, { useState } from "react";

const CommentOverlay = ({ fileId, onClose, onSubmit }) => {
  const [commentText, setCommentText] = useState("");

  // Handle change in textarea
  const handleChange = (e) => {
    setCommentText(e.target.value);
  };

  // Handle submit button click
  const handleSubmit = async () => {
    console.log("Submit button clicked with text:", commentText);
    if (!commentText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

  // Trigger the parent component's onSubmit (which will handle the API call)
    try {
      await onSubmit(commentText); // Make sure this triggers the callback
      setCommentText(""); // Reset comment input after submission
      onClose(); // Close the overlay after successful submission
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("There was an error submitting your comment.");
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
          onChange={handleChange}
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose} // Close overlay when cancel button is clicked
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit} // Submit comment when clicked
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

