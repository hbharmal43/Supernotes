import React, { useState, useEffect } from "react";
import axios from "axios";

const Comments = ({ noteId }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  // Fetch comments when the component is mounted or the noteId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/comments?noteId=${noteId}`
        );
        setComments(response.data.comments || []);
      } catch (err) {
        setError("Failed to load comments");
        console.error("Error fetching comments:", err);
      }
    };

    if (noteId) {
      fetchComments();
    }
  }, [noteId]);

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      alert("Please enter a comment.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/comments",
        {
          noteId,
          commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
          },
        }
      );

      if (response.data.success) {
        setCommentText("");
        setComments((prevComments) => [
          ...prevComments,
          {
            text: commentText,
            createdBy: "You", // Replace with actual username if needed
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        alert("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    }
  };

  return (
    <div>
      <h3>Comments</h3>

      {/* Display any errors */}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleAddComment}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          rows="4"
          className="border p-2 w-full mb-2"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Comment
        </button>
      </form>

      {/* Display comments */}
      <div className="mt-4">
        {comments.length > 0 ? (
          <ul>
            {comments.map((comment, index) => (
              <li key={index} className="border-b py-2">
                <p className="font-semibold">{comment.createdBy}</p>
                <p>{comment.text}</p>
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
