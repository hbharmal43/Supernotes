import React, { useState, useRef, useEffect } from "react";
import FileCardDropdown from "./FileCardDropdown";

const FileCard = ({ file, handleViewFile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center h-auto w-full max-w-[300px] mx-auto">
      <h3 className="text-md font-semibold text-center mb-2">
        {file.fileName}
      </h3>

      {/* Thumbnail Preview */}
      <div className="mt-2 mb-2 w-full h-32 flex justify-center items-center overflow-hidden">
        {file.filePath.endsWith(".pdf") ? (
          <img
            src={`https://via.placeholder.com/150/0000FF/FFFFFF?text=PDF`}
            alt={file.fileName}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <img
            src={file.filePath}
            alt={file.fileName}
            className="w-full h-full object-cover rounded"
          />
        )}
      </div>

      {/* Buttons Container */}
      <div className="mt-auto w-full flex gap-2 justify-between items-center">
        <button
          onClick={() => handleViewFile(file)}
          className="bg-blue-500 text-white flex-1 py-1 rounded hover:bg-blue-600 transition"
        >
          View File
        </button>

        {/* Dropdown Component */}
        <div className="relative" ref={dropdownRef}>
          <FileCardDropdown
            isOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
            fileId={file._id}
          />
        </div>
      </div>
    </div>
  );
};

export default FileCard;
