import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); 
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [message, setMessage] = useState(""); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate courseNumber format
    const courseNumberPattern = /^[A-Za-z]+-\d+$/;
    if (!courseNumberPattern.test(courseNumber)) {
      setMessage("Course Number format should be COURSENAME-NUMBER (e.g., CSE-3315).");
      return;
    }

    if (!file || !fileName || !description || !tags || !courseNumber) {
      setMessage("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("courseNumber", courseNumber);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
    setMessage("");
  };

  const resetForm = () => {
    setFile(null);
    setFileName("");
    setDescription("");
    setTags("");
    setCourseNumber("");
  };

  return (
    <div className="bg-white p-3 rounded">
<<<<<<< HEAD
      <h2 className="text-center" style={{ color: "#4a90e2", fontWeight: "bold", fontSize: "24px" }}>
=======
      <h2
        className="text-center"
        style={{ color: "#4a90e2", fontWeight: "bold", fontSize: "24px" }}
      >
>>>>>>> 270774e738df28c30dd7fd75e19d880cee026025
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
<<<<<<< HEAD
            style={{ border: '2px solid #ccc', width: '90%', margin: '0 auto' }}
=======
            style={{ border: "2px solid #ccc", width: "90%", margin: "0 auto" }} // Subtle gray border
>>>>>>> 270774e738df28c30dd7fd75e19d880cee026025
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
<<<<<<< HEAD
            style={{ border: '2px solid #ccc', width: '90%', margin: '0 auto' }}
=======
            style={{ border: "2px solid #ccc", width: "90%", margin: "0 auto" }} // Subtle gray border
>>>>>>> 270774e738df28c30dd7fd75e19d880cee026025
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="form-control"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
<<<<<<< HEAD
            style={{ border: '2px solid #ccc', width: '90%', margin: '0 auto' }}
=======
            style={{ border: "2px solid #ccc", width: "90%", margin: "0 auto" }} // Subtle gray border
>>>>>>> 270774e738df28c30dd7fd75e19d880cee026025
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Course Number (e.g., COURSENAME-NUMBER)"
            className="form-control"
            value={courseNumber}
            onChange={(e) => setCourseNumber(e.target.value)}
<<<<<<< HEAD
            style={{ border: '2px solid #ccc', width: '90%', margin: '0 auto' }}
=======
            style={{ border: "2px solid #ccc", width: "90%", margin: "0 auto" }} // Subtle gray border
>>>>>>> 270774e738df28c30dd7fd75e19d880cee026025
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
<<<<<<< HEAD
              backgroundColor: '#3b82f6',
              color: '#333',
              borderRadius: '15px',
              border: 'none',
              padding: '5px 10px',
              width: '25%',
=======
              backgroundColor: "#3b82f6", // Vibrant pastel green
              color: "#333",
              borderRadius: "15px", // Rounded corners
              border: "none", // No border
              padding: "5px 10px", // Reduced padding for smaller buttons
              width: "25%", // Set a width for smaller buttons
>>>>>>> 270774e738df28c30dd7fd75e19d880cee026025
            }}
          >
            Upload
          </button>
          <button
            type="button"
            className="btn"
            style={{
<<<<<<< HEAD
              backgroundColor: '#ef4444',
              color: '#333',
              borderRadius: '15px',
              border: 'none',
              padding: '5px 10px',
              width: '25%',
=======
              backgroundColor: "#ef4444", // Vibrant pastel red
              color: "#333",
              borderRadius: "15px", // Rounded corners
              border: "none", // No border
              padding: "5px 10px", // Reduced padding for smaller buttons
              width: "25%", // Set a width for smaller buttons
>>>>>>> 270774e738df28c30dd7fd75e19d880cee026025
            }}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>

      {message && (
        <p
          className="text-center mt-3"
          style={{ color: message.includes("successfully") ? "green" : "red" }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
