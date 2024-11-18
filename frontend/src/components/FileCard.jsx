import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import FileCardDropdown from "./FileCardDropdown";

const FileCard = ({ file, handleViewFile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userRating, setUserRating] = useState(0); // Individual user's rating
  const [averageRating, setAverageRating] = useState(0); // File's average rating
  const [reviewCount, setReviewCount] = useState(0); // Total reviews
  const dropdownRef = useRef(null);

  const handleRatingClick = async (value) => {
    console.log("File ID:", file._id); // Log fileId to confirm it's valid
    try {
      const response = await axios.post(
        `http://localhost:5000/api/files/rate`,
        {
          fileId: file._id,
          rating: value,
        }
      );
      const { averageRating, totalRatings } = response.data;

      // Update the average and review count
      setAverageRating(averageRating);
      setReviewCount(totalRatings);

      // Set the user's specific rating
      setUserRating(value);
    } catch (error) {
      console.error("Error saving rating:", error);
    }
  };

  // Handle clicking outside the dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        console.log("Fetching data for file:", file.fileName);
        const { data } = await axios.get(
          `http://localhost:5000/api/files/${file._id}/ratings`
        );
        console.log("Rating data:", data);

        setAverageRating(data.averageRating || 0);
        setReviewCount(data.totalRatings || 0);
        setUserRating(data.userRating || 0); // If your API provides user's rating
      } catch (error) {
        console.error("Error fetching rating data:", error);
      }
    };

    fetchRatingData();
  }, [file._id]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center h-auto w-full max-w-[280px] mx-auto transform transition-transform hover:scale-105 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">
        {file.fileName}
      </h3>

      {/* Thumbnail Preview */}
      <div className="mb-4 w-full h-36 flex justify-center items-center overflow-hidden rounded border border-gray-300">
        <img
          src="/7670113.png" // Replace with the correct thumbnail path
          alt={file.fileName}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Star Rating */}
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => handleRatingClick(star)}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
              star <= (userRating > 0 ? userRating : averageRating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600 text-sm">
          {averageRating ? averageRating.toFixed(1) : "0.0"} ({reviewCount || 0}
          )
        </span>
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
