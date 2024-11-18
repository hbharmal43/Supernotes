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

    const courseNumberPattern = /^[A-Za-z]+-\d+$/;
    if (!courseNumberPattern.test(courseNumber)) {
      setMessage(
        "Course Number format should be COURSENAME-NUMBER (e.g., CSE-3315)."
      );
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
      const response = await axios.post(
        "http://localhost:5001/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
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
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-center text-2xl font-bold text-blue-500 mb-4">
        File Upload
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="File Name"
          className="form-input w-full border border-gray-300 rounded p-2"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="form-textarea w-full border border-gray-300 rounded p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          className="form-input w-full border border-gray-300 rounded p-2"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          type="text"
          placeholder="Course Number (e.g., COURSENAME-NUMBER)"
          className="form-input w-full border border-gray-300 rounded p-2"
          value={courseNumber}
          onChange={(e) => setCourseNumber(e.target.value)}
        />
        <input
          type="file"
          className="form-input w-full border border-gray-300 rounded p-2"
          onChange={handleFileChange}
        />
        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg w-5/12 hover:bg-blue-600 transition"
          >
            Upload
          </button>
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded-lg w-5/12 hover:bg-red-600 transition"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
      {message && (
        <p
          className={`text-center mt-4 ${
            message.includes("successfully") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
