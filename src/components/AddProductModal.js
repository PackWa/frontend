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

    if (selectedFile && existingPhotoPath) {
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
      </div>
  );
};

export default AddProductModal;