import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation from react-router-dom

function Sidebar({ onOpenModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get the current location

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => location.pathname === path; // Function to check if a path is active

  return (
    <>
      {/* Hamburger Menu Button - Only Visible for Small Screens */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-gray-500 text-white rounded-md block md:hidden"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 w-64`}
      >
        <div className="flex justify-between items-center p-4">
          <h5 className="text-white text-lg font-semibold">SuperNotes</h5>
          {/* Close Button - Only Visible for Small Screens */}
          <button
            className="text-white block md:hidden"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <hr className="border-gray-700 mx-2" />
        {/* Navigation Links */}
        <ul className="flex flex-col space-y-2 p-4">
          <li>
            <Link
              to="/"
              className={`block p-2 text-white rounded-lg ${
                isActive("/")
                  ? "bg-blue-800 hover:text-opacity-80"
                  : "bg-gray-800 hover:bg-gray-700"
              } transition`}
            >
              Courses
            </Link>
          </li>
          <li>
            <Link
              to="/mynotes"
              className={`block p-2 text-white rounded-lg ${
                isActive("/mynotes")
                  ? "bg-blue-800 hover:text-opacity-80"
                  : "bg-gray-800 hover:bg-gray-700"
              } transition`}
            >
              My Notes
            </Link>
          </li>
          <li>
            <a
              href="#"
              className="block p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Saved Notes
            </a>
          </li>
          <li>
            <Link
              to="/dashboard"
              className={`block p-2 text-white rounded-lg ${
                isActive("/dashboard")
                  ? "bg-blue-800 hover:text-opacity-80"
                  : "bg-gray-800 hover:bg-gray-700"
              } transition`}
            >
              Profile
            </Link>
          </li>
        </ul>
        <hr className="border-gray-700 mx-2" />
        <div className="absolute bottom-0 w-full p-4">
          <button
            className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-700 transition"
            onClick={onOpenModal}
          >
            Create a New Note
          </button>
        </div>
      </div>

      {/* Background overlay when sidebar is open on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
