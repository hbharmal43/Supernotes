import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation

function Sidebar({ onOpenModal }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Menu Button - Only Visible for Small Screens */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md block md:hidden"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:w-64 w-64`}
      >
        <div className="flex justify-between items-center p-4 bg-gray-800">
          <h5 className="text-white text-lg">Notes</h5>
          {/* Close Button - Only Visible for Small Screens */}
          <button className="text-white block md:hidden" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <hr className="border-gray-700" />

        {/* Navigation Links */}
        <ul className="flex flex-col space-y-2 p-4">
          <li>
            <Link to="/" className="block p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
              Courses
            </Link>
          </li>


          <li>
            <a href="/mynotes" className="block p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
              My Notes
            </a>
          </li>
          <li>
            <a href="#" className="block p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
              Saved Notes
            </a>
          </li>
       
        <li>
          <Link to="/dashboard" className="block p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
            Profile
          </Link>
        </li>
        </ul>
        <hr className="border-gray-700" />

        {/* Create Note Button */}
        <button
          className="w-full bg-black text-white p-2 mt-2 rounded-lg hover:bg-gray-800 transition"
          onClick={onOpenModal}
        >
          Create a New Note
        </button>
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
