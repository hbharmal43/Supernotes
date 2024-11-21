import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentOverlay from "../components/CommentOverlay"; // Import the CommentOverlay

function PdfListPage() {
  const [files, setFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null); // State to track the file being viewed
  const [showCommentOverlay, setShowCommentOverlay] = useState(false); // State to control visibility of the CommentOverlay
  const [selectedFile, setSelectedFile] = useState(null); // State to track the selected file for commenting

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await axios.get("http://localhost:5000/api/files");
      setFiles(response.data);
    };
    fetchFiles();
  }, []);

  const handleViewFile = (file) => {
    setViewingFile(file); // Set the file to be viewed
    setSelectedFile(file); // Set the selected file for the comment overlay
    setShowCommentOverlay(true); // Show the comment overlay when a file is viewed
  };

  const handleCloseViewer = () => {
    setViewingFile(null); // Close the viewer
    setShowCommentOverlay(false); // Hide the comment overlay when closing the viewer
  };

  const handleCloseCommentOverlay = () => {
    setShowCommentOverlay(false); // Close the overlay
    setSelectedFile(null); // Reset selected file
  };

  return (
    <div className="flex">
      {/* Right Side: PDF Viewer */}
      <div className="flex-1 p-4">
        <h1 className="text-xl font-semibold mb-6">Files List</h1>
        {files.map((file) => (
          <div key={file._id} className="mb-4 border p-4 rounded shadow">
            <p>{file.fileName}</p>
            <p>{file.description}</p>
            <p>{file.tags.join(", ")}</p>

            {/* View Link */}
            <button
              onClick={() => handleViewFile(file)} // Open the PDF in the viewer and show the comment overlay
              className="text-blue-500 underline mr-2"
            >
              View File
            </button>

            {/* Download Link */}
            <a
              href={`http://localhost:5000/uploads/${file.filename}`} // Backend URL for file
              target="_blank"
              rel="noopener noreferrer"
              download
              className="text-blue-500 underline"
            >
              Download File
            </a>

            {/* Open Comment Overlay for each file */}
            <button
              onClick={() => handleViewFile(file)} // Open overlay with selected file
              className="text-blue-500 underline ml-2"
            >
              Add Comment
            </button>
          </div>
        ))}

        {/* PDF Viewer */}
        {viewingFile && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="flex bg-white p-4 rounded shadow-lg relative">
              <button
                onClick={handleCloseViewer}
                className="absolute top-2 right-2 text-red-500 font-bold"
              >
                X
              </button>

              {/* PDF Iframe */}
              <iframe
                src={`http://localhost:5000/uploads/${viewingFile.filename}`} // URL of the PDF file
                width="600"
                height="800"
                title="PDF Viewer"
              ></iframe>

              {/* Comment Overlay */}
              {showCommentOverlay && (
                <div className="w-1/4 p-4 border-l bg-white">
                  <CommentOverlay
                    fileId={selectedFile?._id}
                    onClose={handleCloseCommentOverlay}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfListPage;

