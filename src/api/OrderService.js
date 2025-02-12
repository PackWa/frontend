import axios from "axios";
import config from "../config";

const API_URL = config.BASE_URL + "/order/";

export const fetchOrders = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const createOrder = async (orderData, token) => {
  try {
    const response = await axios.post(API_URL, orderData, {
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

export const updateOrder = async (orderId, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}${orderId}`, updatedData, {
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

export const deleteOrder = async (orderId, token) => {
  try {
    await axios.delete(`${API_URL}${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const getOrderById = async (orderId, token) => {
  try {
    const response = await axios.get(`${API_URL}${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
