import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUsername", res.data.username);
      navigate("/admin");
    } catch {
      setError("İstifadəçi adı və ya şifrə yanlışdır");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/aromalife-logo.jpg" alt="AromaLife" />
        </div>

        <h1 className="login-title">Admin Panel</h1>
        <p className="login-subtitle">
          Daxil olmaq üçün məlumatlarınızı daxil edin
        </p>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <FiUser size={16} className="login-field-icon" />
            <input
              type="text"
              name="username"
              placeholder="İstifadəçi adı"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <FiLock size={16} className="login-field-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Şifrə"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="login-field-eye"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Yüklənir..." : "Daxil ol"}
          </button>
        </form>
      </div>
    </div>
  );
}
