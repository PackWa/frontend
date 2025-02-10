import React, { useState, useEffect } from "react";

const AddClientModal = ({ isOpen, onClose, onSave }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFirstName("");
      setLastName("");
      setPhone("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!first_name || !last_name || !phone) {
      alert("Заполните все поля!");
      return;
    }
    onSave({ first_name, last_name, phone });
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
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
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
