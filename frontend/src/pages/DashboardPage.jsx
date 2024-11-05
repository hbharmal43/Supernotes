import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import { useState } from "react";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  const handleLogout = () => {
    logout();
  };

  // Function to open the FileUpload modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the FileUpload modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-r from-blue-900 to-blue-600">
      {/* Sidebar */}
      <Sidebar onOpenModal={openModal} />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="flex-grow max-w-md w-full mx-auto my-10 p-8 bg-gray-50 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-black text-transparent bg-clip-text">
          Dashboard
        </h2>

        <div className="space-y-6">
          <motion.div
            className="p-4 bg-white shadow-lg bg-opacity-60 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-black mb-3">
              Profile Information
            </h3>
            <p className="text-black">Name: {user.name}</p>
            <p className="text-black">Email: {user.email}</p>
          </motion.div>
          <motion.div
            className="p-4 bg-white shadow-lg bg-opacity-60 rounded-lg "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-black mb-3">
              Account Activity
            </h3>
            <p className="text-black">
              <span className="font-bold">Joined: </span>
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-black">
              <span className="font-bold">Last Login: </span>
              {formatDate(user.lastLogin)}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900"
          >
            Logout
          </motion.button>
        </motion.div>
      </motion.div>

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
              {/* Add your FileUpload component here */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
