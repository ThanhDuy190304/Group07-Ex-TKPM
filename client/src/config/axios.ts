import axios from "axios";

const BASE_URL: string = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
    baseURL: BASE_URL, // Định nghĩa base URL chung
    headers: { "Content-Type": "application/json" },
});

export default api;