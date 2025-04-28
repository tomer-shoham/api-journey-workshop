import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use the API base URL from environment variables
  headers: {
    "Content-Type": "application/json"
  }
});
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
export default apiClient;
