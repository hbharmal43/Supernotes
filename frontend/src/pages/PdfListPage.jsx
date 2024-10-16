import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PdfListPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await axios.get('http://localhost:5000/api/files');
      setFiles(response.data);
    };
    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Files List</h1>
      {files.map(file => (
        <div key={file._id} className="mb-4">
          <p>{file.fileName}</p>
          <p>{file.description}</p>
          <p>{file.tags.join(', ')}</p>

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
        </div>
      ))}
    </div>
  );
}

export default PdfListPage;
