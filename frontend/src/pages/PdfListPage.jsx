import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PdfListPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/files');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="container">
      <h2>Uploaded Notes</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <a href={`http://localhost:3001/api/files/${file}`} target="_blank" rel="noopener noreferrer">
              {file}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PdfListPage;
