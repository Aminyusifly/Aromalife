import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiShoppingBag,
  FiMessageSquare,
  FiPackage,
  FiLogOut,
  FiMenu,
  FiX,
  FiEye,
  FiEyeOff,
  FiSettings,
} from "react-icons/fi";
import { useState } from "react";
import api from "../../services/api";
import "./adminlayout.css";

const navItems = [
  { to: "/admin", icon: <FiGrid size={18} />, label: "Dashboard", end: true },
  {
    to: "/admin/orders",
    icon: <FiShoppingBag size={18} />,
    label: "Sifarişlər",
  },
  {
    to: "/admin/whatsapp-orders",
    icon: <FiMessageSquare size={18} />,
    label: "WhatsApp",
  },
  { to: "/admin/products", icon: <FiPackage size={18} />, label: "Məhsullar" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const username = localStorage.getItem("adminUsername") || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    navigate("/admin/login");
  };

  const openPasswordModal = () => {
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setError("");
    setSuccess(false);
    setPasswordModal(true);
  };

  const handlePasswordChange = async () => {
    setError("");
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword)
      return setError("Bütün sahələri doldurun");
    if (form.newPassword.length < 8)
      return setError("Yeni şifrə ən az 8 simvol olmalıdır");
    if (form.newPassword !== form.confirmPassword)
      return setError("Yeni şifrələr uyğun gəlmir");
    if (form.currentPassword === form.newPassword)
      return setError("Yeni şifrə köhnə ilə eyni ola bilməz");

    setSaving(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        setPasswordModal(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-logo">
          <img src="/aromalife-logo.jpg" alt="AromaLife" />
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-block">
            <div className="admin-user-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="admin-user-name">{username}</span>
          </div>
          <div className="admin-footer-actions">
            <button
              className="admin-icon-btn"
              onClick={openPasswordModal}
              title="Şifrəni dəyiş"
            >
              <FiSettings size={16} />
            </button>
            <button
              className="admin-icon-btn danger"
              onClick={handleLogout}
              title="Çıxış"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-btn"
            onClick={() => setSidebarOpen((p) => !p)}
          >
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </header>
        <main className="admin-content">{children}</main>
      </div>

      {passwordModal && (
        <div className="modal-overlay" onClick={() => setPasswordModal(false)}>
          <div
            className="modal simple-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Şifrəni dəyiş</h2>
              <button
                className="modal-close"
                onClick={() => setPasswordModal(false)}
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="modal-body">
              {success ? (
                <div className="pw-success">✅ Şifrə uğurla dəyişdirildi!</div>
              ) : (
                <div className="modal-fields">
                  {error && <div className="pw-error">{error}</div>}
                  <div className="modal-field">
                    <label>Cari şifrə</label>
                    <div className="pw-input-wrap">
                      <input
                        type={showCurrent ? "text" : "password"}
                        value={form.currentPassword}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            currentPassword: e.target.value,
                          }))
                        }
                        placeholder="Cari şifrənizi daxil edin"
                      />
                      <button
                        type="button"
                        className="pw-toggle"
                        onClick={() => setShowCurrent((p) => !p)}
                      >
                        {showCurrent ? (
                          <FiEyeOff size={16} />
                        ) : (
                          <FiEye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="modal-field">
                    <label>Yeni şifrə</label>
                    <div className="pw-input-wrap">
                      <input
                        type={showNew ? "text" : "password"}
                        value={form.newPassword}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder="Ən az 8 simvol"
                      />
                      <button
                        type="button"
                        className="pw-toggle"
                        onClick={() => setShowNew((p) => !p)}
                      >
                        {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="modal-field">
                    <label>Yeni şifrəni təkrar daxil edin</label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="Yeni şifrəni təkrar yazın"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handlePasswordChange()
                      }
                    />
                  </div>
                </div>
              )}
            </div>
            {!success && (
              <div className="modal-footer">
                <button
                  className="modal-cancel"
                  onClick={() => setPasswordModal(false)}
                >
                  Ləğv et
                </button>
                <button
                  className="modal-save"
                  onClick={handlePasswordChange}
                  disabled={saving}
                >
                  {saving ? "Saxlanılır..." : "Şifrəni dəyiş"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
