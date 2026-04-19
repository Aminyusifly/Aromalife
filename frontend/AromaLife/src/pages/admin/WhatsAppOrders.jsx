import { useState, useEffect } from "react";
import {
  getWhatsAppOrders,
  approveWhatsAppOrder,
  rejectWhatsAppOrder,
} from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  FiCheck,
  FiX,
  FiChevronDown,
  FiPhone,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi";
import "./whatsapporders.css";

const statusColors = {
  Gözləyir: "status-new",
  Təsdiqləndi: "status-done",
  "Rədd edildi": "status-cancel",
  "Müddəti bitdi": "status-prep",
};

export default function WhatsAppOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Gözləyir");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getWhatsAppOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveWhatsAppOrder(id);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "Təsdiqləndi" } : o)),
      );
      setExpandedId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Xəta baş verdi");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Bu sifarişi rədd etmək istədiyinizə əminsiniz?")) return;
    setActionLoading(id);
    try {
      await rejectWhatsAppOrder(id);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "Rədd edildi" } : o)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Xəta baş verdi");
    } finally {
      setActionLoading(null);
    }
  };

  const handleNotify = (order) => {
    const lines = [
      `Hörmətli ${order.customerName},`,
      ``,
      `${order.code} nömrəli sifarişiniz təsdiqləndi və hazırlanır.`,
      ``,
      `Təşəkkür edirik! 🌟`,
      `AromaLife`,
    ];
    const message = encodeURIComponent(lines.join("\n"));
    const phone = order.customerPhone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const tabs = [
    "Hamısı",
    "Gözləyir",
    "Təsdiqləndi",
    "Rədd edildi",
    "Müddəti bitdi",
  ];

  const filtered =
    filterStatus === "Hamısı"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const pendingCount = orders.filter((o) => o.status === "Gözləyir").length;

  return (
    <AdminLayout>
      <div className="wp-orders-page">
        <div className="wp-orders-header">
          <div className="wp-orders-title-wrap">
            <h1 className="wp-orders-title">WhatsApp Sifarişlər</h1>
            {pendingCount > 0 && (
              <span className="wp-pending-badge">{pendingCount} gözləyir</span>
            )}
          </div>
          <p className="wp-orders-count">{filtered.length} sifariş</p>
        </div>

        {/* Tabs */}
        <div className="wp-tabs">
          {tabs.map((s) => (
            <button
              key={s}
              className={`wp-tab ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
              <span className="wp-tab-count">
                {s === "Hamısı"
                  ? orders.length
                  : orders.filter((o) => o.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="wp-loading">Yüklənir...</div>
        ) : filtered.length === 0 ? (
          <div className="wp-empty">
            <FiMessageSquare size={40} />
            <p>Sifariş tapılmadı</p>
          </div>
        ) : (
          <div className="wp-orders-list">
            {filtered.map((order) => (
              <div
                key={order.id}
                className={`wp-order-card ${order.status === "Gözləyir" ? "pending" : ""}`}
              >
                {/* Header */}
                <div
                  className="wp-order-header"
                  onClick={() =>
                    setExpandedId(expandedId === order.id ? null : order.id)
                  }
                >
                  <div className="wp-order-left">
                    <div className="wp-order-code">{order.code}</div>
                    <div className="wp-order-customer">
                      <p className="wp-order-name">{order.customerName}</p>
                      <p className="wp-order-phone">
                        <FiPhone size={12} />
                        {order.customerPhone}
                      </p>
                    </div>
                  </div>

                  <div className="wp-order-right">
                    <span className="wp-order-amount">
                      {order.totalAmount.toFixed(2)} AZN
                    </span>
                    <span
                      className={`status-pill ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <div className="wp-order-expires">
                      <FiClock size={12} />
                      {new Date(order.createdAt).toLocaleDateString("az-AZ")}
                    </div>
                    <FiChevronDown
                      size={16}
                      className={`wp-chevron ${expandedId === order.id ? "rotated" : ""}`}
                    />
                  </div>
                </div>

                {/* Detail */}
                {expandedId === order.id && (
                  <div className="wp-order-detail">
                    {/* Items */}
                    <div className="wp-order-items">
                      {order.items.map((item, i) => (
                        <div key={i} className="wp-order-item">
                          <div className="wp-order-item-info">
                            <p className="wp-order-item-name">
                              {item.productName} — {item.ml}ml
                            </p>
                            <span className="wp-order-item-qty">
                              x{item.quantity}
                            </span>
                          </div>
                          <p className="wp-order-item-price">
                            {(item.unitPrice * item.quantity).toFixed(2)} AZN
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Note */}
                    {order.note && (
                      <div className="wp-order-note">
                        <p>{order.note}</p>
                      </div>
                    )}

                    {/* Expires */}
                    {order.status === "Gözləyir" && (
                      <div className="wp-order-expires-warn">
                        <FiClock size={14} />
                        Son tarix:{" "}
                        {new Date(order.expiresAt).toLocaleString("az-AZ")}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="wp-order-actions">
                      {order.status === "Gözləyir" && (
                        <>
                          <button
                            className="wp-btn-approve"
                            disabled={actionLoading === order.id}
                            onClick={() => handleApprove(order.id)}
                          >
                            <FiCheck size={16} />
                            {actionLoading === order.id
                              ? "Gözləyin..."
                              : "Təsdiqlə"}
                          </button>

                          <button
                            className="wp-btn-reject"
                            disabled={actionLoading === order.id}
                            onClick={() => handleReject(order.id)}
                          >
                            <FiX size={16} />
                            Rədd et
                          </button>
                        </>
                      )}

                      {order.status === "Təsdiqləndi" && (
                        <button
                          className="wp-btn-notify"
                          onClick={() => handleNotify(order)}
                        >
                          <FiMessageSquare size={16} />
                          Müştərini məlumatlandır
                        </button>
                      )}
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
