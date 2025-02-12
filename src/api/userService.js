import axios from "axios";
import config from "../config";

const API_URL = config.BASE_URL + "/user";

export const getUserData = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/me`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        } else {
            throw new Error("Something went wrong. Please try again later.");
        }
    }
};