import axios from "axios";

const API_URL = "http://sovwva7.fvds.ru/api/order/";

// Получение всех заказов
export const fetchOrders = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    return [];
  }
};

// Создание нового заказа
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
    console.error("Ошибка при создании заказа:", error);
    return null;
  }
};

// Обновление заказа
export const updateOrder = async (orderId, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении заказа:", error);
    return null;
  }
};

// Удаление заказа
export const deleteOrder = async (orderId, token) => {
  try {
    await axios.delete(`${API_URL}/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error("Ошибка при удалении заказа:", error);
    return false;
  }
};

// Получение заказа по ID
export const getOrderById = async (orderId, token) => {
    try {
      const response = await axios.get(`${API_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении заказа:", error);
      return null;
    }
  };