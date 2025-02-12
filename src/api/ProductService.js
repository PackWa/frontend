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
