import axios from "axios";
import config from "../config";

const API_URL = config.BASE_URL + "/client/";

// Получение всех клиентов
export const fetchClients = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении клиентов:", error);
    return [];
  }
};

// Создание нового клиента
export const createClient = async (clientData, token) => {
  try {
    const response = await axios.post(API_URL, clientData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании клиента:", error);
    return null;
  }
};

// Обновление клиента
export const updateClient = async (clientId, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${clientId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении клиента:", error);
    return null;
  }
};

// Удаление клиента
export const deleteClient = async (clientId, token) => {
  try {
    await axios.delete(`${API_URL}/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error("Ошибка при удалении клиента:", error);
    return false;
  }
};
