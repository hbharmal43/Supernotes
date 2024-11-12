import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comments = ({ fileId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments when the component mounts or fileId changes
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/comments/${fileId}`);
        setComments(response.data.comments);
      } catch (err) {
        setError('Error fetching comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [fileId]);

  // Handle submitting a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        '/api/comments/add',
        {
          fileId,
          commentText: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setComments((prevComments) => [...prevComments, response.data.comment]); // Add the new comment
      setNewComment(''); // Clear the input field
    } catch (err) {
      setError('Error posting comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Comments</h2>
      {error && <p className="error">{error}</p>}

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

          <div className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button onClick={handleAddComment} disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;

