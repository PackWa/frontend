import React, { useState, useEffect } from "react";
import { fetchClients, createClient, updateClient, deleteClient } from "../api/ClientService";
import AddClientModal from "../components/AddClientModal";

const Clients = ({ token }) => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    const loadClients = async () => {
      const clientsData = await fetchClients(token);
      setClients(clientsData);
    };
    loadClients();
  }, [token]);

  const handleEdit = (client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const success = await deleteClient(id, token);
    if (success) {
      setClients(clients.filter((client) => client.id !== id));
    }
  };

  const handleSave = async () => {
    const updatedClient = await updateClient(editingClient.id, editingClient, token);
    if (updatedClient) {
      setClients(clients.map(client => client.id === editingClient.id ? updatedClient : client));
    }
    setModalOpen(false);
  };

  const handleAddClient = async (newClient) => {
    const createdClient = await createClient(newClient, token);
    if (createdClient) {
      setClients([...clients, createdClient]);
    }
  };

  return (
    <div className="clients-container">
      <h2>Клиенты</h2>
      <div className="controls">
        <input type="text" placeholder="🔍 Поиск клиентов..." className="search-input" />
        <button className="add-button" onClick={() => setAddModalOpen(true)}>
          Добавить клиента
        </button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.surname}</td>
                <td>{client.phone}</td>
                <td>
                  <button onClick={() => handleEdit(client)}>Редактировать</button>
                  <button onClick={() => handleDelete(client.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Редактировать клиента</h3>
            <input
              type="text"
              value={editingClient.name}
              onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
            />
            <input
              type="text"
              value={editingClient.surname}
              onChange={(e) => setEditingClient({ ...editingClient, surname: e.target.value })}
            />
            <input
              type="text"
              value={editingClient.phone}
              onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
            />
            <button onClick={handleSave}>Сохранить</button>
            <button onClick={() => setModalOpen(false)}>Закрыть</button>
          </div>
        </div>
      )}

      <AddClientModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onSave={handleAddClient} />

      <style jsx="true">{`
        .clients-container {
          padding: 80px 20px 20px; /* Отступ сверху под NavBar */
          max-width: 1000px;
          margin: 0 auto;
        }
        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .search-input {
          padding: 8px;
          width: 60%;
          max-width: 300px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .add-button {
          padding: 8px 12px;
          cursor: pointer;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          white-space: nowrap;
        }
        th {
          background-color: #333;
          color: white;
        }
        button {
          margin: 5px;
          padding: 5px 10px;
          cursor: pointer;
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

        @media (max-width: 600px) {
          .controls {
            flex-direction: column;
            gap: 10px;
          }
          .search-input {
            width: 100%;
          }
          table {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Clients;