import axios from "axios";
import config from "../config";

const API_URL = config.BASE_URL + "/client/";

export const fetchClients = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

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
    return null;
  }
};

export const updateClient = async (clientId, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}${clientId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteClient = async (clientId, token) => {
  try {
    await axios.delete(`${API_URL}${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};
