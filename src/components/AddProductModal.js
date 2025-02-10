import React, { useState } from "react";

const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // Для хранения выбранного файла
  const [imagePreview, setImagePreview] = useState(""); // Для предпросмотра фото

  // Обработчик выбора файла
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Предпросмотр фото
    }
  };

  // Обработчик изменения цены (только цифры)
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Проверяем, что введены только цифры
      setPrice(value);
    }
  };

  // Обработчик сохранения
  const handleSave = () => {
    if (!name || !description || !price || !image) {
      alert("Заполните все поля и выберите фото!");
      return;
    }

    // Создаем объект продукта
    const newProduct = {
      name,
      description,
      price: parseInt(price), // Преобразуем строку в число
      image, // Сохраняем файл
    };

    onSave(newProduct);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Добавить продукт</h3>
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Цена"
          value={price}
          onChange={handlePriceChange} // Используем кастомный обработчик
          pattern="\d*" // Разрешаем только цифры
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Предпросмотр" />
          </div>
        )}
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default AddProductModal;