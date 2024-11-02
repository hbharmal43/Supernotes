import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CourseFilesPage() {
  const { courseNumber } = useParams();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // New state to handle loading

  useEffect(() => {
    // Fetch files related to the course
    const fetchFiles = async () => {
      try {
        console.log("Fetching files for course:", courseNumber); // Debugging line

        const response = await axios.get(`http://localhost:5000/api/files?courseNumber=${courseNumber}`);
        console.log("Response from backend:", response.data); // Debugging line

        setFiles(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load files. Please try again.");
        console.error("Error fetching files:", err);
        setLoading(false);
      }
    };

    fetchFiles();
  }, [courseNumber]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow p-8 bg-gray-100">
        <h1 className="text-4xl font-bold text-center mb-6">Files for {courseNumber}</h1>

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
                <p className="text-sm text-gray-500">Tags: {file.tags}</p>

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
                  View File
                </a>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="text-center text-gray-500">No files available for this course.</p>
        )}
      </div>
    </div>
  );
}

export default CourseFilesPage;

