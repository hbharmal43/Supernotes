import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // Assuming Sidebar is located in components
import axios from 'axios'; // To fetch the files from the backend
import { useParams } from 'react-router-dom';

function CourseFilesPage() {
  const { courseNumber } = useParams(); // Extract the course number from the route
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch files related to the course
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/files?courseNumber=${courseNumber}`);
        setFiles(response.data); // Assuming response.data is the list of files
      } catch (err) {
        setError("Failed to load files. Please try again.");
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

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Files List */}
        {!error && files.length > 0 ? (
          <ul className="space-y-4">
            {files.map((file, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold">{file.fileName}</h3>
                <p>{file.description}</p>
                <p className="text-sm text-gray-500">Tags: {file.tags}</p>
                {/* Link to download/view the file */}
                <a
                  href={`http://localhost:5000/uploads/${file.filename}`}
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
          <p className="text-center text-gray-500">
            {files.length === 0 && !error ? 'No files available for this course.' : ''}
          </p>
        )}
      </div>
    </div>
  );
}

export default CourseFilesPage;
