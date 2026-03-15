import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (isLocalhost ? "https://localhost:7185/api" : "");

const api = axios.create({
  baseURL: apiBaseUrl,
});

export default api;
