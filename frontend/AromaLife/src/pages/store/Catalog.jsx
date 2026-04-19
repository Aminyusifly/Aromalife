import { useState, useEffect } from "react";
import { filterProducts } from "../../services/api";
import Navbar from "../../components/store/Navbar";
import ProductCard from "../../components/store/ProductCard";
import FilterPanel from "../../components/store/FilterPanel";
import {
  FiSearch,
  FiSliders,
  FiX,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import "./Catalog.css";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ gender: null });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const params = {};
      if (filters.gender) params.gender = filters.gender;
      if (search) params.search = search;
      const res = await filterProducts(params);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleReset = () => {
    setFilters({ gender: null });
    setSearch("");
    setError(false);
  };

  return (
    <div className="catalog-page">
      <Navbar />

      <div className="catalog-container">
        <div className="catalog-search-wrap">
          <form className="catalog-search" onSubmit={handleSearch}>
            <FiSearch size={18} className="catalog-search-icon" />
            <input
              type="text"
              placeholder="Ətir axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="catalog-search-clear"
                onClick={() => {
                  setSearch("");
                  fetchProducts();
                }}
              >
                <FiX size={16} />
              </button>
            )}
          </form>
          <button
            className="catalog-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
          >
            <FiSliders size={16} />
            Filtrlər
          </button>
        </div>

        <div className="catalog-layout">
          <div className="catalog-filter-desktop">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={handleReset}
            />
          </div>

          {mobileFilterOpen && (
            <>
              <div
                className="catalog-filter-overlay"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="catalog-filter-drawer">
                <div className="catalog-filter-drawer-header">
                  <h3>Filtrlər</h3>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <FiX size={20} />
                  </button>
                </div>
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onReset={handleReset}
                />
              </div>
            </>
          )}

          <div className="catalog-main">
            <div className="catalog-toolbar">
              <p className="catalog-count">
                {loading
                  ? "Yüklənir..."
                  : error
                    ? ""
                    : `${products.length} məhsul`}
              </p>
            </div>

            {loading ? (
              <div className="catalog-loading">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="catalog-skeleton" />
                ))}
              </div>
            ) : error ? (
              <div className="catalog-error">
                <FiAlertCircle size={40} />
                <p>Məhsullar yüklənərkən xəta baş verdi</p>
                <button onClick={fetchProducts}>
                  <FiRefreshCw size={14} />
                  Yenidən cəhd et
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="catalog-empty">
                <FiSearch size={48} />
                <p>Məhsul tapılmadı</p>
                <button onClick={handleReset}>Filtrləri sıfırla</button>
              </div>
            ) : (
              <div className="catalog-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
