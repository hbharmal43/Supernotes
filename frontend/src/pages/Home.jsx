import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // Assuming the Sidebar is located in components
import FileUpload from "../components/FileUpload"; // Assuming the FileUpload is located in components

function Home() {
  // State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the FileUpload modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the FileUpload modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 w-3/5 p-8 "> {/* Removed any external blue background */}
      {/* Sidebar */}
      <Sidebar onOpenModal={openModal} />

      {/* Main content */}
      <div className="flex-grow p-8 pr-8">
        <h1 className="text-4xl font-bold text-center mb-6">Welcome to Your Notes Dashboard</h1>
        <p className="text-lg text-center text-gray-700 mb-4">
          Select a course from the sidebar or create a new note to get started.
        </p>

        {/* Example of main content or dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">CSE-3311 </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">CSE-3315</div>
          <div className="bg-white p-6 rounded-lg shadow-lg">CSE-4316</div>
          <div className="bg-white p-6 rounded-lg shadow-lg">CSE-4322</div>
          <div className="bg-white p-6 rounded-lg shadow-lg">CSE-4344</div>
        </div>
      </div>

      {/* Modal Structure - shows FileUpload when isModalOpen is true */}
      {isModalOpen && (
        <>
          {/* Modal overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={closeModal} // Clicking outside the modal will close it
          ></div>

          {/* Modal content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h5 className="text-xl font-semibold text-gray-800">
                  Create a New Note
                </h5>
                <button
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* FileUpload Component */}
              <FileUpload closeModal={closeModal} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
 