import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommentForm from "../components/CommentForm";
import Sidebar from "../components/Sidebar";

const CommentsPage = () => {
  const { fileId } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/comments/${fileId}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [fileId]);

  return (
    <div className="bg-blue-100 min-h-screen flex items-center justify-center w-[55%]">
      <Sidebar />

      <div className="bg-white p-9 rounded-md shadow-md w-full max-w-[90%] max-h-[80%]">
        <h1 className="text-2xl font-semibold mb-4">Comments for this file</h1>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p>
                <strong>{comment.userId}</strong>: {comment.text}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <CommentForm fileId={fileId} />
      </div>
    </div>
  );
};

export default CommentsPage;
