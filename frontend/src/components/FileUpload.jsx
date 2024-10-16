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
        setMessage(`File uploaded successfully to course ${courseNumber}!`);
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
      <h2 className="text-center" style={{ color: "#4a90e2", fontWeight: "bold" }}>File Upload</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="File Name"
            className="form-control"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="form-control"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Course Number (e.g., CSE-3315)"
            className="form-control"
            value={courseNumber}
            onChange={(e) => setCourseNumber(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Upload</button>
        <button type="button" className="btn btn-light w-100 mt-2 border" onClick={handleCancel}>Cancel</button>
      </form>

      {message && <p className="text-center mt-3" style={{ color: message.includes("successfully") ? "green" : "red" }}>
        {message}
      </p>}
    </div>
  );
}

export default FileUpload;
