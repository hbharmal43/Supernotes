import React, { useState, useRef, useEffect } from "react";
import FileCardDropdown from "./FileCardDropdown";

const FileCard = ({ file, handleViewFile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rating, setRating] = useState(0); // State for rating
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
    // Optionally, you could send this rating to a backend here
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center h-auto w-full max-w-[280px] mx-auto transform transition-transform hover:scale-105 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">
        {file.fileName}
      </h3>

      {/* Thumbnail Preview */}
      <div className="mb-4 w-full h-36 flex justify-center items-center overflow-hidden rounded border border-gray-300">
        <img
          src="/7670113.png" // Make sure this is the correct path
          alt={file.fileName}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Star Rating */}
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => handleRatingClick(star)}
            xmlns="http://www.w3.org/2000/svg"
            fill={star <= rating ? "gold" : "gray"}
            viewBox="0 0 24 24"
            stroke="none"
            className="w-6 h-6 cursor-pointer transition-colors duration-200"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>

      {/* Buttons Container */}
      <div className="w-full flex gap-2 justify-between items-center mt-auto">
        <button
          onClick={() => handleViewFile(file)}
          className="bg-blue-500 text-white py-1.5 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
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
