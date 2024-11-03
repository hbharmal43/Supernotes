import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

function MyNotesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef();

  useEffect(() => {
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

  const toggleDropdown = (fileId) => {
    // Set dropdownOpen to the fileId if it is not already open; otherwise, close it
    setDropdownOpen((prev) => (prev === fileId ? null : fileId));
  };

  const handleFlag = (fileId) => {
    console.log(`Flagged note with ID: ${fileId}`);
    // Add logic to flag the note (e.g., send a request to the backend)
  };

  const handleSave = (fileId) => {
    console.log(`Saved note with ID: ${fileId}`);
    // Add logic to save the note (e.g., send a request to the backend)
  };

  const handleComment = (fileId) => {
    console.log(`Commented on note with ID: ${fileId}`);
    // Add logic to open a comment overlay or dialog
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                <div
                  key={file._id}
                  className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center"
                >
                  <h3 className="text-md font-semibold text-center">{file.fileName}</h3>

                  <div className="mt-2 mb-2 w-full">
                    {file.filePath.endsWith('.pdf') ? (
                      <img
                        src={`https://via.placeholder.com/150/0000FF/FFFFFF?text=PDF`}
                        alt={file.fileName}
                        className="w-full h-auto object-cover rounded"
                      />
                    ) : (
                      <img
                        src={file.filePath}
                        alt={file.fileName}
                        className="w-full h-auto object-cover rounded"
                      />
                    )}
                  </div>

                  <div className="mt-auto flex space-x-2 relative">
                    <a
                      href={file.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600 transition"
                    >
                      View
                    </a>
                    <button
                      onClick={() => deleteFile(file._id)}
                      className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => toggleDropdown(file._id)}
                      className="bg-gray-500 text-white px-2 py-1 text-sm rounded hover:bg-gray-600 transition"
                      aria-expanded={dropdownOpen === file._id}
                      aria-controls={`dropdown-${file._id}`}
                    >
                      Options
                    </button>

                    {dropdownOpen === file._id && (
                      <div ref={dropdownRef} className="absolute bg-white border rounded shadow-lg mt-1 z-10" id={`dropdown-${file._id}`}>
                        <button
                          onClick={() => handleFlag(file._id)}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                        >
                          Flag
                        </button>
                        <button
                          onClick={() => handleSave(file._id)}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleComment(file._id)}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                        >
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && <p className="text-center text-gray-500">No notes available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyNotesPage;
