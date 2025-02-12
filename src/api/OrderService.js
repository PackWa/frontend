/**
 * OrderService Module
 *
 * This module provides functions for interacting with the backend API to manage orders.
 * It includes functionalities for fetching, creating, updating, deleting, and retrieving
 * individual orders. All API requests are authenticated using a bearer token in the request headers.
 *
 * Functions:
 * - fetchOrders: Retrieves a list of orders from the server.
 * - createOrder: Sends a POST request to create a new order.
 * - updateOrder: Sends a PUT request to update an existing order.
 * - deleteOrder: Sends a DELETE request to remove an order from the server.
 * - getOrderById: Retrieves details of a specific order by its ID.
 *
 * Usage:
 * - Each function requires an authorization token to authenticate requests.
 * - The order creation and update functions expect the data to be in JSON format.
 */


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
