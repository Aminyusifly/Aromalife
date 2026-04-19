import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/store/Home";
import Catalog from "./pages/store/Catalog";
import ProductDetail from "./pages/store/ProductDetail";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import WhatsAppOrders from "./pages/admin/WhatsAppOrders";
import Products from "./pages/admin/Products";
import Login from "./pages/admin/Login";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/whatsapp-orders"
          element={
            <PrivateRoute>
              <WhatsAppOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
