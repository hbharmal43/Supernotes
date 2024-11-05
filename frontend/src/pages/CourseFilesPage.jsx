import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import FileCard from "../components/FileCard"; // Import FileCard component
import axios from "axios";
import { useParams } from "react-router-dom";

function CourseFilesPage() {
  const { courseNumber } = useParams();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    // Fetch files related to the course
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/files?courseNumber=${courseNumber}`
        );
        setFiles(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load files. Please try again.");
        setLoading(false);
      }
    };

    fetchFiles();
  }, [courseNumber]);

  const handleViewFile = (file) => {
    setViewingFile(file);
  };

  const handleCloseViewer = () => {
    setViewingFile(null);
  };

  const handleClickOutside = (event) => {
    if (viewerRef.current && !viewerRef.current.contains(event.target)) {
      handleCloseViewer();
    }
  };

  useEffect(() => {
    // Add event listener for clicking outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      {/* Sidebar */}
      <div className="w-1/5 min-w-[200px] h-full">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-grow p-8 overflow-auto">
        <div className="bg-gray-50 bg-opacity-80 rounded-lg shadow-lg p-8 h-full">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
            Files for {courseNumber}
          </h1>

          {/* Loading State */}
          {loading && (
            <p className="text-center text-gray-500">Loading files...</p>
          )}

          {/* Error Message */}
          {error && !loading && (
            <p className="text-red-500 text-center">{error}</p>
          )}

          {/* Files List */}
          {!error && !loading && files.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {files.map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  handleViewFile={handleViewFile}
                />
              ))}
            </div>
          ) : (
            !loading && (
              <p className="text-center text-gray-500">
                No files available for this course.
              </p>
            )
          )}
        </div>

        {/* PDF Viewer */}
        {viewingFile && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div
              className="bg-white p-4 rounded shadow-lg relative"
              ref={viewerRef}
            >
              <button
                onClick={handleCloseViewer}
                className="absolute top-2 right-2 text-red-500 font-bold"
              >
                X
              </button>
              <iframe
                src={`http://localhost:5000/uploads/${viewingFile.filename}`}
                width="600"
                height="800"
                title="PDF Viewer"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseFilesPage;
