import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // User-provided file name
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [courseNumber, setCourseNumber] = useState(""); // New state for course number
  const [message, setMessage] = useState(""); // State to store success/error message

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !fileName || !description || !tags || !courseNumber) {
      setMessage("Please fill in all fields.");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName); // Add the file name
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("courseNumber", courseNumber); // Add the course number

    try {
      // Send form data to backend
      const response = await axios.post(
        "http://localhost:5000/api/upload", // Ensure this matches your backend URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setMessage(`File uploaded successfully for course ${courseNumber}!`);
        resetForm();
      } else {
        setMessage("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("An error occurred during the file upload.");
    }
  };

  const handleCancel = () => {
    resetForm();
    setMessage(""); // Clear the message on cancel
    navigate(-1); // Navigate back to the previous page
  };

  const resetForm = () => {
    setFile(null);
    setFileName("");
    setDescription("");
    setTags("");
    setCourseNumber(""); // Reset course number
  };

  return (
      <div className="bg-white p-3 rounded">
      <h2 className="text-center" style={{ color: "#4a90e2", fontWeight: "bold",fontSize: "24px" }}>
        File Upload
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="File Name"
            className="form-control"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{ border: '2px solid #ccc', width: '90%', margin: '0 auto' }} // Subtle gray border
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ border: '2px solid #ccc', width: '90%', margin: '0 auto' }} // Subtle gray border
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="form-control"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ border: '2px solid #ccc', width: '90%', margin: '0 auto' }} // Subtle gray border
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Course Number (e.g., CSE-3315)"
            className="form-control"
            value={courseNumber}
            onChange={(e) => setCourseNumber(e.target.value)}
            style={{ border: '2px solid #ccc', width: '90%', margin: '0 auto' }} // Subtle gray border
          />
        </div>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: '#3b82f6', // Vibrant pastel green
              color: '#333',
              borderRadius: '15px', // Rounded corners
              border: 'none', // No border
              padding: '5px 10px', // Reduced padding for smaller buttons
              width: '25%', // Set a width for smaller buttons
            }}
          >
            Upload
          </button>
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: '#ef4444', // Vibrant pastel red
              color: '#333',
              borderRadius: '15px', // Rounded corners
              border: 'none', // No border
              padding: '5px 10px', // Reduced padding for smaller buttons
              width: '25%', // Set a width for smaller buttons
            }}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>

      {message && (
        <p className="text-center mt-3" style={{ color: message.includes("successfully") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
