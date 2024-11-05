import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import UserFileCard from '../components/UserFileCard'; // Adjust the path as needed
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MyNotesPage() {
  const { courseNumber } = useParams();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const viewerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch files related to the user
    const fetchUserFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/files/my-content', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFiles(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user files:', err);
        setError('Failed to load your notes. Please try again.');
        setLoading(false);
      }
    };

    fetchUserFiles();
  }, []);

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
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const deleteFile = async (fileId) => {
    const confirmed = window.confirm('Are you sure you want to delete this file?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles(files.filter(file => file._id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete the file. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="w-1/4">
        <Sidebar />
      </div>

      <div className="flex-grow p-10">
        <div className="bg-gray-50 bg-opacity-80 rounded-lg shadow-lg p-8" style={{ height: '90vh' }}>
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">My Notes</h1>

          {loading && <p className="text-center text-gray-500">Loading your notes...</p>}
          {error && !loading && <p className="text-red-500 text-center">{error}</p>}

          {!error && !loading && files.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {files.map((file) => (
                <UserFileCard
                  key={file._id}
                  file={file}
                  handleViewFile={handleViewFile}
                  deleteFile={deleteFile}
                />
              ))}
            </div>
          ) : (
            !loading && <p className="text-center text-gray-500">No notes available.</p>
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

export default MyNotesPage;

