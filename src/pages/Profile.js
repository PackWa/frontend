import React, { useState } from "react";
import "../styles/styles.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+123456789",
  });

  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setUser(editedUser);
    setEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>Профиль</h2>
      <div className="profile-info">
        <p><strong>Имя:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Телефон:</strong> {user.phone}</p>
        <button className="edit-button" onClick={handleEdit}>Редактировать</button>
      </div>

      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h3>Редактирование профиля</h3>
            <input
              type="text"
              value={editedUser.name}
              onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
            />
            <input
              type="email"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            />
            <input
              type="text"
              value={editedUser.phone}
              onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
            />
            <button onClick={handleSave}>Сохранить</button>
            <button onClick={() => setEditing(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
