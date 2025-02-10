import axios from "axios";

const API_URL = "http://sovwva7.fvds.ru/api/product/";

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
export const fetchProductPhoto = (filename) => {
  return `${API_URL}/photo/${filename}`;
};

// Создание нового продукта
export const createProduct = async (productData, token) => {
  try {
    const formData = new FormData();
    formData.append("title", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("photo", productData.image);

    const response = await axios.post(API_URL, formData, {
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
    const response = await axios.put(`${API_URL}/${productId}`, updatedData, {
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
    await axios.delete(`${API_URL}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error);
    return false;
  }
};
