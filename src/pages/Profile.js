import React, { useState } from "react";

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

      <style jsx="true">{`
        .profile-container {
          padding: 80px 20px 20px; /* Отступ от NavBar */
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .profile-info {
          background: #f8f8f8;
          padding: 20px;
          border-radius: 10px;
        }
        .edit-button {
          margin-top: 10px;
          padding: 8px 12px;
          cursor: pointer;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
        }
        input {
          display: block;
          width: 100%;
          margin: 8px 0;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Profile;
