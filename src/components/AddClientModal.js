import React, { useState, useEffect } from "react";

const AddClientModal = ({ isOpen, onClose, onSave }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFirstName("");
      setLastName("");
      setPhone("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!firstName || !lastName || !phone) {
      alert("Please fill in all fields!");
      return;
    }
    onSave({ firstName, lastName, phone });
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
          />
          <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
