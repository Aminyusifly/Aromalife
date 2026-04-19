import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

// Auth
export const login = (data) => api.post("/auth/login", data);

// Products
export const getProducts = () => api.get("/product");
export const getProductById = (id) => api.get(`/product/${id}`);
export const filterProducts = (params) =>
  api.get("/product/filter", { params });
export const createProduct = (data) => api.post("/product", data);
export const updateProduct = (id, data) => api.put(`/product/${id}`, data);
export const deleteProduct = (id) => api.delete(`/product/${id}`);

// Orders
export const getOrders = () => api.get("/order");
export const getOrderById = (id) => api.get(`/order/${id}`);
export const createOrder = (data) => api.post("/order", data);
export const updateOrderStatus = (id, status) =>
  api.patch(`/order/${id}/status`, { status });
export const deleteOrder = (id) => api.delete(`/order/${id}`);

// WhatsApp Orders
export const getWhatsAppOrders = () => api.get("/whatsapporder");
export const createWhatsAppOrder = (data) => api.post("/whatsapporder", data);
export const approveWhatsAppOrder = (id) =>
  api.post(`/whatsapporder/${id}/approve`);
export const rejectWhatsAppOrder = (id) =>
  api.post(`/whatsapporder/${id}/reject`);

// Dashboard
export const getDashboardStats = () => api.get("/dashboard");
export const getExtendedStats = () => api.get("/dashboard/extended");

export default api;
