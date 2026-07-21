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

export const getCategories = (params = {}) => api.get("/categories", { params }).then((r) => r.data);

export const createCategory = (data) => api.post("/categories", data).then((r) => r.data);

export const updateCategory = (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data);

export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data);

export const getSettings = () => api.get("/settings").then((r) => r.data);

export const updateSettings = (data) => api.put("/settings", data).then((r) => r.data);

export const createOrder = (data) => api.post("/orders", data).then((r) => r.data);

export const getOrders = (params = {}) => api.get("/orders", { params }).then((r) => r.data);

export const getOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data);

export const confirmarOrder = (id) => api.patch(`/orders/${id}/confirmar`).then((r) => r.data);

export const cancelarOrder = (id, notasAdmin) =>
  api.patch(`/orders/${id}/cancelar`, { notasAdmin }).then((r) => r.data);

export const createReview = (data) => api.post("/reviews", data).then((r) => r.data);

export const getReviews = (params = {}) => api.get("/reviews", { params }).then((r) => r.data);

export const getAllReviews = (params = {}) => api.get("/reviews/admin", { params }).then((r) => r.data);

export const aprobarReview = (id) => api.patch(`/reviews/${id}/aprobar`).then((r) => r.data);

export const deleteReview = (id) => api.delete(`/reviews/${id}`).then((r) => r.data);

export const getAdmins = () => api.get("/admins").then((r) => r.data);

export const createAdminUser = (data) => api.post("/admins", data).then((r) => r.data);

export const deleteAdminUser = (id) => api.delete(`/admins/${id}`).then((r) => r.data);

export default api;
