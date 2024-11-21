import React, { useState, useRef, useEffect } from "react";
import FileCardDropdown from "./FileCardDropdown";

function UserFileCard({ file, handleViewFile, deleteFile }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleFlag = () => {
    console.log(`Flagged note with ID: ${file._id}`);
  };

  const handleSave = () => {
    console.log(`Saved note with ID: ${file._id}`);
  };

  const handleComment = () => {
    console.log(`Commented on note with ID: ${file._id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center w-full h-full">
      <h3 className="text-md font-semibold text-center">{file.fileName}</h3>

      {/* Thumbnail Preview */}
      <div className="mb-4 w-full h-36 flex justify-center items-center overflow-hidden rounded border border-gray-300">
        {file.filePath && file.filePath.endsWith(".pdf") ? (
          <img
            src={`https://via.placeholder.com/150/0000FF/FFFFFF?text=PDF`}
            alt={file.fileName}
            className="object-cover w-full h-full"
          />
        ) : (
          <img
            src={file.filePath}
            alt={file.fileName}
            className="object-cover w-full h-full"
          />
        )}
      </div>

      {/* Buttons Container */}
      <div className="mt-auto flex flex-col space-y-2 w-full">
        <button
          onClick={() => {
            console.log("Attempting to open:", file.filePath);
            handleViewFile(file);
          }}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
        >
          View
        </button>
        <button
          onClick={() => deleteFile(file._id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
        <button
          onClick={toggleDropdown}
          className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 transition"
          aria-expanded={dropdownOpen}
        >
          Options
        </button>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="bg-white border rounded shadow-lg w-full z-10 mt-2"
          >
            <button
              onClick={handleFlag}
              className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
            >
              Flag
            </button>
            <button
              onClick={handleSave}
              className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
            >
              Save
            </button>
            <button
              onClick={handleComment}
              className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-left"
            >
              Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserFileCard;


