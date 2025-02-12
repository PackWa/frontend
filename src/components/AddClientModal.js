import React, { useState, useEffect } from "react";

const AddClientModal = ({ isOpen, onClose, onSave }) => {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFirst_name("");
      setLast_name("");
      setPhone("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!first_name || !last_name || !phone) {
      alert("Please fill in all fields!");
      return;
    }
    onSave({ first_name: first_name, last_name: last_name, phone });
    onClose();
  };

  if (!isOpen) return null;

  return (
      <div className="modal">
        <div className="modal-content">
          <h3>Add Client</h3>
          <input
              type="text"
              placeholder="First Name"
              value={first_name}
              onChange={(e) => setFirst_name(e.target.value)}
          />
          <input
              type="text"
              placeholder="Last Name"
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
          />
          <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
  );
};

export default AddClientModal;
