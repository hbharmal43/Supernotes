import React, { useState } from "react";
import axios from "axios";
import CommentOverlay from "./CommentOverlay"; // Import the CommentOverlay component

const FileCardDropdown = ({ isOpen, toggleDropdown, fileId }) => {
  const [isCommenting, setIsCommenting] = useState(false); // State to manage comment overlay visibility

  const handleFlag = async () => {
    const description = prompt(
      "Please describe the issue with this file and mention the filename too:"
    );
    if (description) {
      try {
        await axios.post("http://localhost:5000/api/flag", { description });
        alert("Flag raised and notification sent.");
      } catch (error) {
        console.error("Error sending flag notification:", error);
        alert("Failed to send the flag notification. Please try again.");
      }
    }
  };

  const handleAction = (action) => {
    if (action === "Flagged") {
      handleFlag();
    } else if (action === "Commented") {
      setIsCommenting(true); // Show the comment overlay when "Comment" is clicked
    } else {
      console.log(`${action} file with ID: ${fileId}`);
    }
    toggleDropdown(); // Close dropdown after action
  };

  const closeOverlay = () => {
    setIsCommenting(false); // Close the overlay when "Cancel" or "Submit" is clicked in CommentOverlay
  };

  return (
    <div>
      <button
        onClick={toggleDropdown}
        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition z-10"
      >
        Options
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow-lg z-10">
          <button
            onClick={() => handleAction("Flagged")}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Flag
          </button>
          <button
            onClick={() => handleAction("Saved")}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Save
          </button>
          <button
            onClick={() => handleAction("Commented")}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Comment
          </button>
        </div>
      )}

      {isCommenting && (
        <CommentOverlay fileId={fileId} onClose={closeOverlay} />
      )}
    </div>
  );
};

export default FileCardDropdown;
