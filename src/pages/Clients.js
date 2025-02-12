/**
 * Clients Component
 *
 * This component handles the management of client data, including viewing, searching,
 * adding, editing, and deleting clients. It supports offline and online modes, where
 * client data is either fetched from the server or from the local database, depending
 * on the network status. The component also includes a modal for adding or editing clients
 * and integrates search functionality for filtering the displayed client list.
 *
 * Key Features:
 * - Fetches client data from the server when online and from the local database when offline.
 * - Allows users to add, edit, and delete clients.
 * - Provides a search bar to filter clients by their name or phone number.
 * - Uses modals for adding and editing clients.
 * - Syncs changes with the server when online.
 *
 * Usage:
 * - Requires an authentication token for interacting with the server API.
 * - On editing or adding a client, the modal form collects and updates client information.
 * - Clients can be filtered by their first name, last name, or phone number using the search bar.
 */


import React, { useState, useEffect } from "react";
import { fetchClients, createClient, updateClient, deleteClient } from "../api/ClientService";
import AddClientModal from "../components/AddClientModal";
import { getAllClients, addClient, deleteClientFromDB } from "../services/database";
import SearchBar from "../components/SearchBar";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
          clientsData.forEach(addClient);
        } catch (error) {
          console.error("Error loading clients:", error);
        }
      } else {
        const localClients = await getAllClients();
        setClients(localClients);
      }
    };

    loadClients();
  }, [token, isOnline]);

  const handleEdit = (client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!token) return;

    const isConfirmed = window.confirm("Are you sure you want to delete this client?");
    if (!isConfirmed) return;

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
      const tempClient = { ...newClient, id: Date.now() };
      setClients([...clients, tempClient]);
      addClient(tempClient);
    }
  };

  const filteredClients = clients.filter((client) =>
      (client.first_name + " " + client.last_name + " " + client.phone)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
  );

  return (
      <div className="clients-container">
        <div className="controls">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} text={"🔍 search"} />
          <button className="add-button" onClick={() => setAddModalOpen(true)}>
            Add Client
          </button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.first_name}</td>
                  <td>{client.last_name}</td>
                  <td>{client.phone}</td>
                  <td>
                    <button onClick={() => handleEdit(client)}>edit</button>
                    <button style={{color: "red"}} onClick={() => handleDelete(client.id)}>delete</button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {modalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h3>Edit Client</h3>
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
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setModalOpen(false)}>Close</button>
              </div>
            </div>
        )}

        <AddClientModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onSave={handleAddClient} />
      </div>
  );
};

export default Clients;
