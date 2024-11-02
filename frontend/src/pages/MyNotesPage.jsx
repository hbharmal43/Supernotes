import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

function MyNotesPage() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // New state to handle loading

  useEffect(() => {
    // Fetch user's uploaded notes
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/files/my-content');
        setFiles(response.data.files);
        setLoading(false);
      } catch (err) {
        setError("Failed to load files. Please try again.");
        console.error("Error fetching files:", err);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow p-8 bg-gray-100">
        <h1 className="text-4xl font-bold text-center mb-6">Your Uploaded Notes</h1>

        {/* Loading State */}
        {loading && <p className="text-center text-gray-500">Loading files...</p>}

        {/* Error Message */}
        {error && !loading && <p className="text-red-500 text-center">{error}</p>}

        {/* Files List */}
        {!error && !loading && files.length > 0 ? (
          <ul className="space-y-4">
            {files.map((file, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold">{file.fileName}</h3>
                <p>{file.description}</p>
                <p className="text-sm text-gray-500">Tags: {file.tags.join(', ')}</p>

                {/* Thumbnail Preview */}
                {file.filePath.endsWith('.pdf') ? (
                  <img
                    src={`https://via.placeholder.com/150/0000FF/FFFFFF?text=PDF`}
                    alt={file.fileName}
                    className="mt-2 mb-2 w-32 h-32 object-cover"
                  />
                ) : (
                  <img
                    src={file.filePath}
                    alt={file.fileName}
                    className="mt-2 mb-2 w-32 h-32 object-cover"
                  />
                )}

                <a
                  href={file.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Open File
                </a>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-center text-gray-500">No files uploaded.</p>
        )}
      </div>
    </div>
  );
}

export default MyNotesPage;

