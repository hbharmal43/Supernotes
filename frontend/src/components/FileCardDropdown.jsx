import React from "react";

const FileCardDropdown = ({ isOpen, toggleDropdown, fileId }) => {
  const handleAction = (action) => {
    console.log(`${action} file with ID: ${fileId}`);
    toggleDropdown(); // Close dropdown after action
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
    </div>
  );
};

export default FileCardDropdown;
