import axios from "axios";
import config from "../config";

const API_URL = config.BASE_URL + "/product/";

// Получение всех продуктов
export const fetchProducts = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении продуктов:", error);
    return [];
  }
};

// Получение фото продукта
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
    console.error("Ошибка при загрузке фото:", response.statusText);
    return null;
  }

  const photoBlob = await response.blob();

  if (photoBlob instanceof Blob) {
    if (photoBlob.type.startsWith('image/jpeg')) {
      console.log("Получено изображение JPG");
      return photoBlob;
    } else {
      console.error("Получено не изображение JPG, тип:", photoBlob.type);
      return null;
    }
  } else {
    console.error("Ошибка: полученный объект не является Blob");
    return null;
  }
};



// Создание нового продукта
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
    console.error("Ошибка при создании продукта:", error);
    return null;
  }
};

// Обновление продукта
export const updateProduct = async (productId, updatedData, token) => {
  try {
    const response = await axios.put(`${API_URL}${productId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error);
    return null;
  }
};

// Удаление продукта
export const deleteProduct = async (productId, token) => {
  try {
    await axios.delete(`${API_URL}${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error);
    return false;
  }
};
