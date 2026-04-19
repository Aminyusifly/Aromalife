import { Link } from "react-router-dom";
import "./productcard.css";

const ML_OPTIONS = [10, 30, 50, 100];

export default function ProductCard({ product }) {
  const calcPrice = (ml) => ((ml / 2) * product.pricePerMl).toFixed(2);

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-header">
        <div className="product-card-gender-badge">{product.gender}</div>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price-ml">1ml = {product.pricePerMl} AZN</p>
      </div>

      <div className="product-card-prices">
        {ML_OPTIONS.map((ml) => (
          <div key={ml} className="product-card-ml-item">
            <span className="product-card-ml">{ml}ml</span>
            <span className="product-card-ml-price">{calcPrice(ml)} AZN</span>
          </div>
        ))}
      </div>

      <div className="product-card-footer">
        <span className="product-card-order">Sifariş et →</span>
      </div>
    </Link>
  );
}
