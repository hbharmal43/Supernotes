import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import FileCard from "../components/FileCard"; // Import FileCard component
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CourseFilesPage() {
  const { courseNumber } = useParams();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const viewerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch files related to the course
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/files?courseNumber=${courseNumber}`);
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
    setViewingFile(file); // Set the file to be viewed
  };

  const handleCloseViewer = () => {
    setViewingFile(null); // Close the viewer
  };

  const handleClickOutside = (event) => {
    if (viewerRef.current && !viewerRef.current.contains(event.target)) {
      handleCloseViewer();
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(null);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleCloseViewer();
      setDropdownOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      {/* Sidebar */}
      <div className="w-1/4">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-grow p-10">
        <div className="bg-gray-50 bg-opacity-80 rounded-lg shadow-lg p-8" style={{ height: '90vh' }}>
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
                Files for {courseNumber}
            </h1>

          {loading && <p className="text-center text-gray-500">Loading files...</p>}
          {error && !loading && <p className="text-red-500 text-center">{error}</p>}

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
            !loading && <p className="text-center text-gray-500">No files available for this course.</p>
          )}
        </div>

        {/* PDF Viewer */}
        {viewingFile && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg relative" ref={viewerRef}>
              <button
                onClick={handleCloseViewer}
                className="absolute top-2 right-2 text-red-500 font-bold"
              >
                X
              </button>
              <iframe
                src={viewingFile.filePath}
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
