import { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiChevronDown,
  FiPackage,
  FiSearch,
} from "react-icons/fi";
import "./products.css";

const ML_OPTIONS = [10, 20, 30, 50, 100];

const emptyForm = {
  name: "",
  gender: "Kişi",
  pricePerMl: "",
  isActive: true,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      gender: product.gender,
      pricePerMl: product.pricePerMl,
      isActive: product.isActive,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.pricePerMl) return;
    setSaving(true);
    try {
      const data = {
        name: form.name,
        gender: form.gender,
        pricePerMl: parseFloat(form.pricePerMl),
        isActive: form.isActive,
      };
      if (editProduct) await updateProduct(editProduct.id, data);
      else await createProduct(data);
      await fetchProducts();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu məhsulu silmək istədiyinizə əminsiniz?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Xəta baş verdi");
    }
  };

  // Fiyat hesaplama: (ml / 2) * pricePerMl
  const calcPrice = (ml, pricePerMl) => ((ml / 2) * pricePerMl).toFixed(2);

  const filteredProducts = products
    .filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (filterGender && p.gender !== filterGender) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price_asc") return a.pricePerMl - b.pricePerMl;
      if (sortBy === "price_desc") return b.pricePerMl - a.pricePerMl;
      return 0;
    });

  return (
    <AdminLayout>
      <div className="products-page">
        <div className="products-header">
          <h1 className="products-title">Məhsullar</h1>
          <button className="products-add-btn" onClick={openCreate}>
            <FiPlus size={18} />
            Məhsul əlavə et
          </button>
        </div>

        {!loading && products.length > 0 && (
          <div className="products-toolbar">
            <div className="products-search">
              <FiSearch size={16} />
              <input
                type="text"
                placeholder="Məhsul axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="products-filters">
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
              >
                <option value="">Bütün cinslər</option>
                <option value="Kişi">Kişi</option>
                <option value="Qadın">Qadın</option>
                <option value="Unisex">Unisex</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Ada görə</option>
                <option value="price_asc">Qiymət artan</option>
                <option value="price_desc">Qiymət azalan</option>
              </select>
            </div>
            <p className="products-count">{filteredProducts.length} məhsul</p>
          </div>
        )}

        {loading ? (
          <div className="products-loading">Yüklənir...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-empty">
            <FiPackage size={48} />
            <p>
              {products.length === 0
                ? "Hələ məhsul yoxdur"
                : "Məhsul tapılmadı"}
            </p>
            {products.length === 0 && (
              <button onClick={openCreate}>İlk məhsulu əlavə et</button>
            )}
          </div>
        ) : (
          <div className="products-list">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`product-list-item ${!product.isActive ? "inactive" : ""}`}
              >
                <div className="product-list-main">
                  <div className="product-list-info">
                    <h3 className="product-list-name">{product.name}</h3>
                    <div className="product-list-meta">
                      <span className="product-list-gender">
                        {product.gender}
                      </span>
                      <span className="product-list-price-ml">
                        1ml = {product.pricePerMl} AZN
                      </span>
                      {!product.isActive && (
                        <span className="product-list-inactive">Deaktiv</span>
                      )}
                    </div>
                  </div>
                  <div className="product-list-prices">
                    {ML_OPTIONS.map((ml) => (
                      <div key={ml} className="product-ml-price">
                        <span className="product-ml">{ml}ml</span>
                        <span className="product-price">
                          {calcPrice(ml, product.pricePerMl)} AZN
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="product-list-actions">
                  <button
                    className="product-edit-btn"
                    onClick={() => openEdit(product)}
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button
                    className="product-delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal simple-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{editProduct ? "Məhsulu redaktə et" : "Yeni məhsul"}</h2>
              <button className="modal-close" onClick={closeModal}>
                <FiX size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-fields">
                <div className="modal-field">
                  <label>Məhsul adı *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Məhsul adı"
                    autoFocus
                  />
                </div>
                <div className="modal-field">
                  <label>Cins</label>
                  <div className="select-wrap">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option value="Kişi">Kişi</option>
                      <option value="Qadın">Qadın</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                    <FiChevronDown size={14} className="select-icon" />
                  </div>
                </div>
                <div className="modal-field">
                  <label>1ml qiyməti (AZN) *</label>
                  <input
                    name="pricePerMl"
                    type="number"
                    step="0.1"
                    value={form.pricePerMl}
                    onChange={handleChange}
                    placeholder="məs. 2.00"
                  />
                </div>

                {form.pricePerMl > 0 && (
                  <div className="modal-price-preview">
                    <p className="modal-price-preview-title">Qiymət baxışı</p>
                    <div className="modal-price-preview-grid">
                      {ML_OPTIONS.map((ml) => (
                        <div key={ml} className="modal-price-preview-item">
                          <span className="modal-preview-ml">{ml}ml</span>
                          <span className="modal-preview-price">
                            {calcPrice(ml, form.pricePerMl)} AZN
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <label className="modal-checkbox">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                  <span>Aktiv məhsul</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={closeModal}>
                Ləğv et
              </button>
              <button
                className="modal-save"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saxlanılır..." : editProduct ? "Yenilə" : "Əlavə et"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
