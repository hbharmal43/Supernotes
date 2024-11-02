import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import FileUpload from "../components/FileUpload";
import axios from "axios";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  // Function to open the FileUpload modal
  const openModal = () => setIsModalOpen(true);

  // Function to close the FileUpload modal
  const closeModal = () => setIsModalOpen(false);

  // Fetch folder names from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const folderResponse = await axios.get('http://localhost:5000/api/courses');
        setFolders(folderResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle class button click
  const handleClassClick = (courseNumber) => {
    navigate(`/courses/${courseNumber}`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 w-3/5 p-8">
      {/* Sidebar */}
      <Sidebar onOpenModal={openModal} />

      {/* Main content */}
      <div className="flex-grow p-8 pr-8">
        <h1 className="text-4xl font-bold text-center text-white-900 mb-6">
          Welcome to Your Notes Dashboard
        </h1>
        <p className="text-lg text-center text-white-900 mb-4">
          Select a course from the sidebar or create a new note to get started.
        </p>

        {/* Class buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.length > 0 ? (
            folders.map((course) => (
              <button
                key={course}
                className="bg-white p-6 rounded-lg shadow-lg w-full text-left"
                onClick={() => handleClassClick(course)}
              >
                {course}
              </button>
            ))
          ) : (
            <p className="text-center text-white">No courses found.</p>
          )}
        </div>
      </div>

      {/* Modal Structure - shows FileUpload when isModalOpen is true */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeModal}></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h5 className="text-xl font-semibold text-gray-800">Create a New Note</h5>
                <button
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

