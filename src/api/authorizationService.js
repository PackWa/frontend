import axios from "axios";
import config from "../config";


const API_URL = config.BASE_URL + "/user";

// Функция для регистрации
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data; // возвращаем данные из ответа
    } catch (error) {
        if (error.response) {
            // Сервер вернул ошибку
            throw error.response.data;
        } else {
            // Ошибка сети или другой тип ошибки
            throw new Error("Что-то пошло не так. Попробуйте позже.");
        }
    }
};

// Функция для входа
export const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, loginData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data; // возвращаем данные из ответа
    } catch (error) {
        if (error.response) {
            // Сервер вернул ошибку
            throw error.response.data;
        } else {
            // Ошибка сети или другой тип ошибки
            throw new Error("Что-то пошло не так. Попробуйте позже.");
        }
    }
};