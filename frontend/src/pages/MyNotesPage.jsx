import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import UserFileCard from "../components/UserFileCard";

function MyNotesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/files/my-content",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFiles(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user files:", err);
        setError("Failed to load your notes. Please try again.");
        setLoading(false);
      }
    };

    fetchUserFiles();
  }, []);

  const deleteFile = async (fileId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles(files.filter((file) => file._id !== fileId));
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete the file. Please try again.");
    }
  };

  return (
    <div className="flex  w-full min-h-screen bg-gradient-to-r from-blue-900 to-blue-600">
      <div>
        <Sidebar />
      </div>

      <div className="flex-grow flex items-center justify-center p-10 md:min-h-[768px]">
        <div
          className="bg-gray-50 bg-opacity-80 rounded-lg shadow-lg p-8 max-w-3xl w-full flex flex-col"
          style={{ height: "90vh" }}
        >
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
            My Notes
          </h1>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {Array(12)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse bg-gray-300 rounded-lg shadow-md w-full h-32"
                  ></div>
                ))}
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : files.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {files.map((file) => (
                <UserFileCard
                  key={file._id}
                  file={file}
                  handleViewFile={(file) =>
                    window.open(file.filePath, "_blank")
                  }
                  deleteFile={deleteFile}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No notes available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyNotesPage;
