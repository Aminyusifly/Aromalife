import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus, deleteOrder } from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  FiTrash2,
  FiChevronDown,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiClock,
} from "react-icons/fi";
import "./orders.css";

const statuses = ["Yeni", "Hazırlanıyor", "Tamamlandı", "İptal"];

const statusColors = {
  Yeni: "status-new",
  Hazırlanıyor: "status-prep",
  Tamamlandı: "status-done",
  İptal: "status-cancel",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Hamısı");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu sifarişi silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered =
    filterStatus === "Hamısı"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <AdminLayout>
      <div className="orders-page">
        <div className="orders-header">
          <h1 className="orders-title">Sifarişlər</h1>
          <p className="orders-count">{filtered.length} sifariş</p>
        </div>

        {/* Filter tabs */}
        <div className="orders-tabs">
          {["Hamısı", ...statuses].map((s) => (
            <button
              key={s}
              className={`orders-tab ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
              <span className="orders-tab-count">
                {s === "Hamısı"
                  ? orders.length
                  : orders.filter((o) => o.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="orders-loading">Yüklənir...</div>
        ) : filtered.length === 0 ? (
          <div className="orders-empty">Sifariş tapılmadı</div>
        ) : (
          <div className="orders-list">
            {filtered.map((order) => (
              <div key={order.id} className="order-card">
                {/* Order header */}
                <div
                  className="order-card-header"
                  onClick={() =>
                    setExpandedId(expandedId === order.id ? null : order.id)
                  }
                >
                  <div className="order-card-left">
                    <span className="order-id">#{order.id}</span>
                    <div className="order-customer">
                      <p className="order-customer-name">
                        {order.customerName}
                      </p>
                      <p className="order-customer-phone">
                        <FiPhone size={12} />
                        {order.customerPhone}
                      </p>
                    </div>
                  </div>

                  <div className="order-card-right">
                    <span className="order-amount">
                      {order.totalAmount.toFixed(2)} AZN
                    </span>
                    <span
                      className={`source-pill ${order.source === "WhatsApp" ? "source-wp" : "source-form"}`}
                    >
                      {order.source}
                    </span>
                    <span
                      className={`status-pill ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <span className="order-date">
                      <FiClock size={12} />
                      {new Date(order.createdAt).toLocaleDateString("az-AZ")}
                    </span>
                    <FiChevronDown
                      size={16}
                      className={`order-chevron ${expandedId === order.id ? "rotated" : ""}`}
                    />
                  </div>
                </div>

                {/* Order detail */}
                {expandedId === order.id && (
                  <div className="order-card-detail">
                    {/* Items */}
                    <div className="order-items">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-item">
                          <div className="order-item-info">
                            <p className="order-item-name">
                              {item.productName} — {item.ml}ml
                            </p>
                            <p className="order-item-qty">x{item.quantity}</p>
                          </div>
                          <p className="order-item-price">
                            {(item.unitPrice * item.quantity).toFixed(2)} AZN
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="order-meta">
                      {order.address && (
                        <p className="order-meta-item">
                          <FiMapPin size={14} />
                          {order.address}
                        </p>
                      )}
                      {order.note && (
                        <p className="order-meta-item">
                          <FiFileText size={14} />
                          {order.note}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="order-actions">
                      <div className="order-status-select-wrap">
                        <select
                          className="order-status-select"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <FiChevronDown
                          size={14}
                          className="order-status-select-icon"
                        />
                      </div>

                      <button
                        className="order-delete-btn"
                        onClick={() => handleDelete(order.id)}
                      >
                        <FiTrash2 size={16} />
                        Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
