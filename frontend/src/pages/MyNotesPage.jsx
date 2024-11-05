import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import UserFileCard from '../components/UserFileCard'; // Adjust the path as needed

function MyNotesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                  handleViewFile={(file) => window.open(file.filePath, '_blank')}
                  deleteFile={deleteFile}
                />
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

