// src/_components/Layout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import FileUpload from "./FileUpload";

function Layout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Sidebar onOpenModal={openModal} />
      <div className="content-with-sidebar">{children}</div>

      {/* Modal Structure */}
      {isModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-labelledby="fileUploadModalLabel"
          aria-hidden="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="fileUploadModalLabel">
                  Create a New Note
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <FileUpload />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optional: Add a backdrop if needed */}
      {isModalOpen && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
          onClick={closeModal}
        ></div>
      )}
    </>
  );
}

export default Layout;
