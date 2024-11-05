import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import FileUpload from "../components/FileUpload";
import axios from "axios";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch folder names from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/courses");
        setFolders(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchData();
  }, []);

  const handleClassClick = (courseNumber) =>
    navigate(`/courses/${courseNumber}`);
  const filteredFolders = folders.filter((course) =>
    course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-r from-blue-900 to-blue-600">
      {/* Sidebar Section */}
      <div>
        <Sidebar onOpenModal={() => setIsModalOpen(true)} />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-10 md:min-h-[768px]">
        <div className="bg-gray-50 bg-opacity-80 rounded-lg shadow-lg p-8 max-w-3xl w-full flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Welcome to Your Notes Dashboard
            </h1>
            <p className="text-lg text-center text-gray-700">
              Select a course from the sidebar or create a new note to get
              started.
            </p>
          </div>

          {/* Search Input */}
          <input
            type="text"
            className="w-full p-4 rounded-lg shadow-sm border mb-6 text-gray-900"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Folder Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              // Show loading skeleton
              Array(12)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse bg-gray-300 p-4 rounded-lg shadow-md w-full h-12"
                  ></div>
                ))
            ) : filteredFolders.length > 0 ? (
              filteredFolders.map((course) => (
                <button
                  key={course}
                  className="bg-white p-4 rounded-lg shadow-md w-full text-left"
                  onClick={() => handleClassClick(course)}
                >
                  {course}
                </button>
              ))
            ) : (
              <div className="flex items-center justify-center col-span-full">
                <p className="text-center text-gray-700">No courses found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for File Upload */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <div className="flex justify-end items-center">
                <button
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setIsModalOpen(false)}
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
              <FileUpload closeModal={() => setIsModalOpen(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
