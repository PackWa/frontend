import React, { useState, useEffect } from "react";
import { getPhotoFromIndexedDB } from "../services/database";

const AddProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [existingPhotoPath, setExistingPhotoPath] = useState("");

  useEffect(() => {
    const initForm = async () => {
      if (product) {
        setId(product.id);
        setTitle(product.title);
        setDescription(product.description);
        setPrice(product.price);
        setExistingPhotoPath(product.photo || "");

        if (product.photo) {
          try {
            const photoData = await getPhotoFromIndexedDB(product.photo);
            setPreview(photoData);
          } catch (error) {
            console.error("Ошибка загрузки фото:", error);
          }
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
    setPreview("");
    setExistingPhotoPath("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setExistingPhotoPath("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);

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
            <h2>{product ? "Редактировать" : "Добавить"} продукт</h2>
          </div>

          <div className="image-section">
            {preview && (
                <img
                    src={preview}
                    alt="Превью"
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
              {preview ? "Изменить фото" : "Выбрать фото"}
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Название:</label>
              <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
              />
            </div>

            <div className="form-group">
              <label>Описание:</label>
              <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
              />
            </div>

            <div className="form-group">
              <label>Цена:</label>
              <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
              />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose}>Отмена</button>
              <button type="submit">Сохранить</button>
            </div>
          </form>
        </div>

        {/* Стилизация модального окна */}
        <style jsx="true">{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .modal-header h2 {
          margin: 0 0 20px;
          text-align: center;
        }
        .image-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }
        .image-preview {
          width: 100%;
          max-width: 300px;
          border-radius: 4px;
          object-fit: cover;
          margin-bottom: 10px;
        }
        .file-label {
          padding: 8px 16px;
          background-color: #007bff;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .file-label:hover {
          background-color: #0056b3;
        }
        input[type="file"] {
          display: none;
        }
        .form-group {
          margin-bottom: 15px;
          text-align: left;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        .modal-actions button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .modal-actions button[type="submit"] {
          background-color: #28a745;
          color: #fff;
        }
        .modal-actions button[type="submit"]:hover {
          background-color: #218838;
        }
        .modal-actions button[type="button"] {
          background-color: #dc3545;
          color: #fff;
        }
        .modal-actions button[type="button"]:hover {
          background-color: #c82333;
        }
      `}</style>
      </div>
  );
};

export default AddProductModal;