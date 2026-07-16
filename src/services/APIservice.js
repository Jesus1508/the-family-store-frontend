import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = Cookies.get("tfs_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post("/auth/login", { email, password }).then((r) => r.data);

export const getProducts = (params = {}) => api.get("/products", { params }).then((r) => r.data);

export const getProduct = (id) => api.get(`/products/${id}`).then((r) => r.data);

export const createProduct = (formData) =>
  api
    .post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);

export const updateProduct = (id, formData) =>
  api
    .put(`/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);

export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);

export default api;
