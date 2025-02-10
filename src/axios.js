import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api/events/", // Update this if your backend URL is different
    withCredentials: true, // Send cookies (for authentication)
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
