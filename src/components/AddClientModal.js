import React, { useState } from "react";

const AddClientModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    if (!name || !surname || !phone) {
      alert("Заполните все поля!");
      return;
    }
    onSave({ name, surname, phone });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Добавить клиента</h3>
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={handleSave}>Сохранить</button>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default AddClientModal;