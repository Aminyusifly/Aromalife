import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartDrawer from "./CartDrawer";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import "./navbar.css";

export default function Navbar() {
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img src="/aromalife-logo.jpg" alt="AromaLife" />
          </Link>

          <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Ana səhifə
              </Link>
            </li>
            <li>
              <Link to="/catalog" onClick={() => setMenuOpen(false)}>
                Katalog
              </Link>
            </li>
          </ul>

          <div className="navbar-right">
            <button className="navbar-cart" onClick={() => setIsCartOpen(true)}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="navbar-cart-badge">{totalItems}</span>
              )}
            </button>

            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen((p) => !p)}
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="navbar-mobile-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
