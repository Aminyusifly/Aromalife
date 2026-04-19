import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { createOrder, createWhatsAppOrder } from "../../services/api";
import Button from "../common/Button";
import "./cartdrawer.css";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount } =
    useCart();
  const [step, setStep] = useState("cart");
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormOrder = async () => {
    if (!form.customerName || !form.customerPhone) return;
    setLoading(true);
    setError("");
    try {
      await createOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        address: form.address,
        note: form.note,
        source: "Form",
        items: cartItems.map((item) => ({
          productId: item.productId,
          ml: item.ml,
          quantity: item.quantity,
        })),
      });
      clearCart();
      setSuccess(true);
      setStep("cart");
      setForm({ customerName: "", customerPhone: "", address: "", note: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    if (!form.customerName || !form.customerPhone) {
      setError("Ad və telefon daxil edin!");
      return;
    }
    setLoading(true);
    setError("");
    console.log("1. Başladı");
    console.log("2. Cart items:", cartItems);
    try {
      console.log("3. API çağırılır...");
      const res = await createWhatsAppOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        note: form.note,
        items: cartItems.map((item) => ({
          productId: item.productId,
          ml: item.ml,
          quantity: item.quantity,
        })),
      });

      const order = res.data;
      const lines = [
        `Salam! Sifariş vermək istəyirəm.`,
        ``,
        `Ad: ${order.customerName}`,
        `Sifariş kodu: ${order.code}`,
        ``,
        ...order.items.map(
          (i) =>
            `- ${i.productName} ${i.ml}ml x${i.quantity} — ${(i.unitPrice * i.quantity).toFixed(2)} AZN`,
        ),
        ``,
        `💰 Cəmi: ${order.totalAmount.toFixed(2)} AZN`,
        ``,
        `Zəhmət olmasa təsdiq edin.`,
      ];

      const message = encodeURIComponent(lines.join("\n"));
      window.open(`https://wa.me/994506912230?text=${message}`, "_blank");

      clearCart();
      setSuccess(true);
      setStep("cart");
      setForm({ customerName: "", customerPhone: "", address: "", note: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>{step === "cart" ? "Səbət" : "Sifariş məlumatları"}</h2>
          <button className="cart-close" onClick={onClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {success && (
          <div className="cart-success">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Sifarişiniz qəbul edildi!
          </div>
        )}

        {step === "cart" && (
          <>
            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  <p>Səbət boşdur</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.key} className="cart-item">
                    <div className="cart-item-info">
                      <p className="cart-item-name">
                        {item.productName.split("/")[0].trim()}
                      </p>
                      <p className="cart-item-volume">
                        {item.ml}ml · {item.pricePerMl} AZN/ml
                      </p>
                      <div className="cart-item-footer">
                        <div className="cart-item-qty">
                          <button
                            onClick={() =>
                              updateQuantity(item.key, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.key, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <span className="cart-item-price">
                          {(item.price * item.quantity).toFixed(2)} AZN
                        </span>
                      </div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.key)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Cəmi</span>
                  <span>{totalAmount.toFixed(2)} AZN</span>
                </div>
                <Button
                  variant="solid"
                  fullWidth
                  onClick={() => setStep("form")}
                >
                  Sifarişi tamamla
                </Button>
              </div>
            )}
          </>
        )}

        {step === "form" && (
          <div className="cart-form">
            <button className="cart-back" onClick={() => setStep("cart")}>
              ← Geri
            </button>

            <div className="cart-form-fields">
              <div className="form-group">
                <label>Ad Soyad *</label>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleFormChange}
                  placeholder="Adınızı daxil edin"
                />
              </div>
              <div className="form-group">
                <label>Telefon *</label>
                <input
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleFormChange}
                  placeholder="+994 XX XXX XX XX"
                />
              </div>
              <div className="form-group">
                <label>Ünvan</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  placeholder="Çatdırılma ünvanı"
                />
              </div>
              <div className="form-group">
                <label>Qeyd</label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleFormChange}
                  placeholder="Əlavə qeydlər..."
                  rows={3}
                />
              </div>
            </div>

            {error && <div className="cart-error">{error}</div>}

            <div className="cart-order-buttons">
              <Button
                variant="solid"
                fullWidth
                disabled={loading}
                onClick={handleFormOrder}
              >
                {loading ? "Göndərilir..." : "Sifarişi təsdiqlə"}
              </Button>
              <div className="cart-or">
                <span>və ya</span>
              </div>
              <Button
                variant="outline"
                fullWidth
                disabled={loading}
                onClick={handleWhatsAppOrder}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp ilə sifariş ver
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
