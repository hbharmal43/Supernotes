import React, { useEffect, useState } from "react";
import axios from "axios";

function PdfListPage() {
  const [files, setFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null); // State to track the file being viewed

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await axios.get("http://localhost:5000/api/files");
      setFiles(response.data);
    };
    fetchFiles();
  }, []);

  const handleViewFile = (file) => {
    setViewingFile(file); // Set the file to be viewed
  };

  const handleCloseViewer = () => {
    setViewingFile(null); // Close the viewer
  };

  return (
    <div>
      <h1>Files List</h1>
      {files.map((file) => (
        <div key={file._id} className="mb-4">
          <p>{file.fileName}</p>
          <p>{file.description}</p>
          <p>{file.tags.join(", ")}</p>

          {/* View Link */}
          <button
            onClick={() => handleViewFile(file)} // Open the PDF in the viewer
            className="text-blue-500 underline mr-2"
          >
            View File
          </button>

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

      {/* PDF Viewer */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg relative">
            <button
              onClick={handleCloseViewer}
              className="absolute top-2 right-2 text-red-500 font-bold"
            >
              X
            </button>
            <iframe
              src={`http://localhost:5000/uploads/${viewingFile.filename}`} // URL of the PDF file
              width="600"
              height="800"
              title="PDF Viewer"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default PdfListPage;
