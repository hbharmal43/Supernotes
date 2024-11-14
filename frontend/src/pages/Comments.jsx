import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentOverlay from "./CommentOverlay";

const Comments = ({ fileId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOverlay, setShowOverlay] = useState(false); // To control overlay visibility

  // Fetch comments when the component mounts or fileId changes
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/comments/${fileId}`);
        setComments(response.data.comments);
      } catch (err) {
        setError("Error fetching comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [fileId]);

  // Handle adding a new comment
  const handleAddComment = async (commentText) => {
    try {
      const response = await axios.post(
        "/api/comments/add",
        { fileId, commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setComments((prevComments) => [
          ...prevComments,
          response.data.comment,
        ]);
      } else {
        alert("Failed to post comment. Please try again.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("An error occurred while posting the comment.");
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <>
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <p>{comment.commentText}</p>
                  <small>By {comment.user.name}</small>
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>

          <button
            onClick={() => setShowOverlay(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Comment
          </button>

          {showOverlay && (
            <CommentOverlay
              fileId={fileId}
              onClose={() => setShowOverlay(false)} // Close the overlay
              onSubmit={handleAddComment} // Pass the function to handle comment submission
            />
          )}
        </>
      )}
    </div>
  );
};

export default Comments;

