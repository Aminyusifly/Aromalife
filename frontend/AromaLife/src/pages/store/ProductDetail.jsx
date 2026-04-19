import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../services/api";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/store/Navbar";
import Button from "../../components/common/Button";
import {
  FiArrowLeft,
  FiShoppingBag,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import "./ProductDetail.css";

const ML_OPTIONS = [10, 20, 30, 50, 100];

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedMl, setSelectedMl] = useState(30);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const calcPrice = (ml) =>
    ml && product ? ((ml / 2) * product.pricePerMl).toFixed(2) : "0.00";

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedMl);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading)
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="product-detail-skeleton">
          <div className="skeleton-info">
            <div className="skeleton-line short" />
            <div className="skeleton-line long" />
            <div className="skeleton-line medium" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="product-detail-not-found">
          <FiAlertCircle size={48} />
          <p>Məhsul yüklənərkən xəta baş verdi</p>
          <Link to="/catalog">Kataloga qayıt</Link>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="product-detail-not-found">
          <FiShoppingBag size={48} />
          <p>Məhsul tapılmadı</p>
          <Link to="/catalog">Kataloga qayıt</Link>
        </div>
      </div>
    );

  return (
    <div className="product-detail-page">
      <Navbar />

      <div className="product-detail-container">
        <Link to="/catalog" className="product-detail-back">
          <FiArrowLeft size={16} />
          Kataloga qayıt
        </Link>

        <div className="product-detail-layout">
          {/* Sol — parfüm ikonu / dekoratif */}
          <div className="product-detail-visual">
            <div className="product-detail-icon-wrap">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
              >
                <path d="M9 3h6v2H9zM7 5h10v2H7zM5 7h14v14H5z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
              <p className="product-detail-visual-name">{product.name}</p>
              <p className="product-detail-visual-gender">{product.gender}</p>
            </div>
            <div className="product-detail-price-ml-info">
              <span>1ml</span>
              <span className="product-detail-price-ml-val">
                {product.pricePerMl} AZN
              </span>
            </div>
          </div>

          {/* Sağ — bilgiler */}
          <div className="product-detail-info">
            <h1 className="product-detail-name">{product.name}</h1>
            <span className="product-detail-gender-badge">
              {product.gender}
            </span>

            {/* ML seçimi */}
            <div className="product-detail-ml-section">
              <p className="product-detail-ml-label">Həcm seçin</p>
              <div className="product-detail-ml-grid">
                {ML_OPTIONS.map((ml) => (
                  <button
                    key={ml}
                    className={`product-detail-ml-btn ${selectedMl === ml ? "active" : ""}`}
                    onClick={() => setSelectedMl(ml)}
                  >
                    <span className="ml-btn-ml">{ml}ml</span>
                    <span className="ml-btn-price">{calcPrice(ml)} AZN</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Seçilen fiyat */}
            <div className="product-detail-price-wrap">
              <span className="product-detail-price-label">Qiymət</span>
              <span className="product-detail-price">
                {calcPrice(selectedMl)} AZN
              </span>
              <span className="product-detail-price-info">
                {selectedMl}ml · {selectedMl / 2}ml parfüm + {selectedMl / 2}ml
                yağ
              </span>
            </div>

            {/* Sepete ekle */}
            <div className="product-detail-actions">
              <Button
                variant={added ? "solid" : "outline"}
                size="lg"
                fullWidth
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <FiCheck size={18} /> Səbətə əlavə edildi
                  </>
                ) : (
                  <>
                    <FiShoppingBag size={18} /> Səbətə əlavə et
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
