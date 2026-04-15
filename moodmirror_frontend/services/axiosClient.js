import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api", 
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Attach token if present
axiosClient.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});


export default axiosClient;
