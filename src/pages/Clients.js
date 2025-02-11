import React, { useState, useEffect } from "react";
import { fetchClients, createClient, updateClient, deleteClient } from "../api/ClientService";
import AddClientModal from "../components/AddClientModal";
import { getAllClients, addClient, deleteClientFromDB } from "../services/database";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const loadClients = async () => {
      if (!token) return;

      if (isOnline) {
        try {
          const clientsData = await fetchClients(token);
          setClients(clientsData);
          clientsData.forEach(addClient); // Сохраняем клиентов в IndexedDB
        } catch (error) {
          console.error("Ошибка загрузки клиентов:", error);
        }
      } else {
        const localClients = await getAllClients();
        setClients(localClients);
      }
    };

    loadClients();
  }, [token, isOnline]);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const handleEdit = (client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!token) return;

    if (isOnline) {
      const success = await deleteClient(id, token);
      if (success) {
        setClients(clients.filter(client => client.id !== id));
        deleteClientFromDB(id);
      }
    } else {
      setClients(clients.filter(client => client.id !== id));
      deleteClientFromDB(id);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    const updatedClient = await updateClient(editingClient.id, editingClient, token);
    if (updatedClient) {
      setClients(clients.map(client => client.id === editingClient.id ? updatedClient : client));
      addClient(updatedClient);
    }
    setModalOpen(false);
  };

  const handleAddClient = async (newClient) => {
    if (!token) return;

    if (isOnline) {
      const createdClient = await createClient(newClient, token);
      if (createdClient) {
        setClients([...clients, createdClient]);
        addClient(createdClient);
      }
    } else {
      const tempClient = { ...newClient, id: Date.now() }; // Временный ID
      setClients([...clients, tempClient]);
      addClient(tempClient);
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
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.first_name}</td>
                <td>{client.last_name}</td>
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
              value={editingClient.first_name}
              onChange={(e) => setEditingClient({ ...editingClient, first_name: e.target.value })}
            />
            <input
              type="text"
              value={editingClient.last_name}
              onChange={(e) => setEditingClient({ ...editingClient, last_name: e.target.value })}
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
    </div>
  );
};

export default Clients;