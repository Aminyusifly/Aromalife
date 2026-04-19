import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { useState } from "react";
import "./filterpanel.css";

export default function FilterPanel({ filters, onChange, onReset }) {
  const [openGender, setOpenGender] = useState(true);

  const handleGender = (gender) => {
    onChange({ ...filters, gender: filters.gender === gender ? null : gender });
  };

  const hasActiveFilters = filters.gender;

  return (
    <aside className="filter-panel">
      <div className="filter-panel-header">
        <h3>Filtrlər</h3>
        {hasActiveFilters && (
          <button className="filter-reset" onClick={onReset}>
            <FiX size={14} />
            Sıfırla
          </button>
        )}
      </div>

      <div className="filter-section">
        <button
          className="filter-section-title"
          onClick={() => setOpenGender((p) => !p)}
        >
          <span>Cins</span>
          {openGender ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </button>
        {openGender && (
          <div className="filter-options">
            {["Kişi", "Qadın", "Unisex"].map((g) => (
              <label key={g} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.gender === g}
                  onChange={() => handleGender(g)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
