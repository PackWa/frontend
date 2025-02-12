import React, { useState, useEffect } from "react";

import photo from "../assets/camera_placeholder.jpg";

const AddProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState("");

  useEffect(() => {
    const initForm = async () => {
      if (product) {
        setTitle(product.title);
        setDescription(product.description);
        setPrice(product.price);
        if (product.image) {
          setImage(product.image);
        }
      } else {
        resetForm();
      }
    };

    if (isOpen) initForm();
  }, [product, isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setSelectedFile(null);
    setImage("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!(title || price)) {
      alert("Product must have a title and price");
    }

    const formData = new FormData();
    if (product?.title !== title) {
      formData.append("title", title);
    }
    if (product?.description !== description) {
      formData.append("description", description);
    }
    if (product?.price !== price) {
      formData.append("price", price);
    }

    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    if (product) formData.append("id", product.id);

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{product ? "Edit" : "Add"} Product</h2>
          </div>

          <div className="image-section">
            {image && (
                <img
                    src={image}
                    alt="Preview"
                    className="image-preview"
                />
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="fileInput"
            />
            <label htmlFor="fileInput" className="file-label">
              {image ? "Change Photo" : "Choose Photo"}
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
              />
            </div>

            <div className="form-group">
              <label>Price:</label>
              <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AddProductModal;
