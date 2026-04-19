import { useState, useEffect } from "react";
import { getDashboardStats } from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  FiShoppingBag,
  FiDollarSign,
  FiMessageSquare,
  FiPackage,
  FiAlertCircle,
  FiClock,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "./Dashboard.css";

const statusColors = {
  Yeni: "status-new",
  Hazırlanıyor: "status-prep",
  Tamamlandı: "status-done",
  İptal: "status-cancel",
};

const sourceColors = {
  Form: "source-form",
  WhatsApp: "source-wp",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [extended, setExtended] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    getDashboardStats()
      .then((s) => setStats(s.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch("http://localhost:5270/api/dashboard/extended", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setExtended(data))
      .catch(console.error);
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <div className="dashboard-loading">Yüklənir...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* Stat cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-card-icon blue">
              <FiShoppingBag size={20} />
            </div>
            <div className="stat-card-info">
              <p className="stat-card-label">Ümumi sifarişlər</p>
              <p className="stat-card-value">{stats.totalOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon gold">
              <FiDollarSign size={20} />
            </div>
            <div className="stat-card-info">
              <p className="stat-card-label">Ümumi gəlir</p>
              <p className="stat-card-value">
                {stats.totalRevenue.toFixed(2)} AZN
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon green">
              <FiMessageSquare size={20} />
            </div>
            <div className="stat-card-info">
              <p className="stat-card-label">WP gözləyənlər</p>
              <p className="stat-card-value">{stats.pendingWpOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon purple">
              <FiPackage size={20} />
            </div>
            <div className="stat-card-info">
              <p className="stat-card-label">Ümumi məhsul</p>
              <p className="stat-card-value">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        {/* Low stock warning */}
        {stats.lowStockProducts > 0 && (
          <div className="dashboard-alert">
            <FiAlertCircle size={18} />
            <span>
              {stats.lowStockProducts} məhsulun stoku azalır (5 və ya daha az)
            </span>
          </div>
        )}

        {/* Charts row */}
        <div className="dashboard-charts-row">
          {extended?.dailySales?.length > 0 && (
            <div className="dashboard-card flex-2">
              <div className="dashboard-card-header">
                <FiTrendingUp size={18} />
                <h2 className="dashboard-card-title">Son 14 günün satışları</h2>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={extended.dailySales}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E8E4D8"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#9C9A95" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9C9A95" }}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1C1A17",
                      border: "none",
                      borderRadius: 6,
                      color: "#FAFAF8",
                      fontSize: 12,
                    }}
                    formatter={(v) => [`${v} AZN`, "Satış"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#C9A84C"
                    strokeWidth={2}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {extended?.topProducts?.length > 0 && (
            <div className="dashboard-card flex-1">
              <div className="dashboard-card-header">
                <FiAward size={18} />
                <h2 className="dashboard-card-title">Ən çox satılan</h2>
              </div>
              <div className="top-products">
                {extended.topProducts.map((p, i) => (
                  <div key={i} className="top-product-row">
                    <div className="top-product-left">
                      <span className="top-product-rank">{i + 1}</span>
                      <span className="top-product-name">{p.productName}</span>
                    </div>
                    <div className="top-product-right">
                      <span className="top-product-qty">
                        {p.totalQuantity} ədəd
                      </span>
                      <span className="top-product-revenue">
                        {p.totalRevenue.toFixed(0)} AZN
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly sales */}
        {stats.monthlySales?.length > 0 && (
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <FiShoppingBag size={18} />
              <h2 className="dashboard-card-title">Aylıq satışlar</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={stats.monthlySales}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E8E4D8"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9C9A95" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(m) => {
                    const months = [
                      "",
                      "Yan",
                      "Fev",
                      "Mar",
                      "Apr",
                      "May",
                      "İyn",
                      "İyl",
                      "Avq",
                      "Sen",
                      "Okt",
                      "Noy",
                      "Dek",
                    ];
                    return months[m] || m;
                  }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9C9A95" }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1C1A17",
                    border: "none",
                    borderRadius: 6,
                    color: "#FAFAF8",
                    fontSize: 12,
                  }}
                  formatter={(v) => [`${v} AZN`, "Gəlir"]}
                />
                <Bar dataKey="total" fill="#C9A84C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent orders */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <FiClock size={18} />
            <h2 className="dashboard-card-title">Son sifarişlər</h2>
          </div>
          {stats.recentOrders?.length === 0 ? (
            <p className="dashboard-empty">Hələ sifariş yoxdur</p>
          ) : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Müştəri</th>
                    <th>Telefon</th>
                    <th>Məbləğ</th>
                    <th>Mənbə</th>
                    <th>Status</th>
                    <th>Tarix</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="dashboard-table-id">#{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.customerPhone}</td>
                      <td>{order.totalAmount.toFixed(2)} AZN</td>
                      <td>
                        <span
                          className={`source-pill ${sourceColors[order.source] || ""}`}
                        >
                          {order.source}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-pill ${statusColors[order.status] || ""}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="dashboard-table-date">
                        <FiClock size={12} />
                        {new Date(order.createdAt).toLocaleDateString("az-AZ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
