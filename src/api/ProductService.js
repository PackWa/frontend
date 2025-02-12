/**
 * ProductService Module
 *
 * This module provides functions to interact with the backend API for managing products.
 * It includes functions for fetching product data, creating, updating, and deleting products,
 * as well as fetching product images. All API requests are secured by passing an authorization
 * token in the request headers.
 *
 * Functions:
 * - fetchProducts: Retrieves a list of products from the server.
 * - fetchProductPhoto: Fetches the photo associated with a product by filename.
 * - createProduct: Sends a POST request to create a new product.
 * - updateProduct: Sends a PUT request to update an existing product.
 * - deleteProduct: Sends a DELETE request to remove a product from the database.
 *
 * Usage:
 * - Each function requires an authorization token to make authenticated requests.
 * - The createProduct function supports sending form data (e.g., product images).
 */


import axios from "axios";
import config from "../config";

const API_URL = config.BASE_URL + "/product/";

export const fetchProducts = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const fetchProductPhoto = async (token, filename) => {
  const headers = new Headers();
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}photo/${filename}`, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    return null;
  }

  const photoBlob = await response.blob();

  if (photoBlob instanceof Blob) {
    if (photoBlob.type.startsWith('image/')) {
      return photoBlob;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const createProduct = async (productData, token) => {
  try {
    const response = await axios.post(API_URL, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (productId, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}${productId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteProduct = async (productId, token) => {
  try {
    await axios.delete(`${API_URL}${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};
