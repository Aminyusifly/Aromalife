import { useState, useEffect } from "react";
import { getProducts } from "../../services/api";
import Navbar from "../../components/store/Navbar";
import ProductCard from "../../components/store/ProductCard";
import { Link } from "react-router-dom";
import { FiMapPin, FiGift, FiMessageCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import "./Home.css";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const campaigns = [
  {
    amount: "300 AZN",
    title: "10% Endirim",
    desc: "300 AZN və üzəri alışlarda bütün məhsullara 10% endirim.",
    icon: "🎁",
    color: "#C9A84C",
  },
  {
    amount: "500 AZN",
    title: "15% Endirim",
    desc: "500 AZN və üzəri alışlarda bütün məhsullara 15% endirim.",
    icon: "✨",
    color: "#B8973B",
  },
  {
    amount: "1000 AZN",
    title: "Xüsusi Hədiyyə",
    desc: "1000 AZN və üzəri alışlarda ətir ləvazimatları, kufrindən flakonlara, yazı aparatı və parfüm suyu hədiyyə.",
    icon: "👑",
    color: "#A07830",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getProducts()
      .then((r) => setProducts(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Pərakəndə və topdan
            <br />
            <em>ətir satışı</em>
          </motion.h1>
          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            5 ölkənin 11 fabrikı ilə işləyən yeganə parfüm mağazası.Pərakəndə
            satış kataloqdan, topdan satış WhatsApp üzərindən.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link to="/catalog" className="hero-btn-primary">
              Kataloqa bax →
            </Link>

            <a
              href="https://wa.me/994506912230"
              target="_blank"
              rel="noreferrer"
              className="hero-btn-secondary"
            >
              Topdan sifariş
            </a>
          </motion.div>
        </div>
        <motion.div
          className="hero-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="hero-stat">
            <span className="hero-stat-num">5</span>
            <span className="hero-stat-label">Ölkə</span>
          </div>
          <div className="hero-divider"></div>
          <div className="hero-stat">
            <span className="hero-stat-num">11</span>
            <span className="hero-stat-label">Fabrik</span>
          </div>
        </motion.div>
      </section>

      {error && (
        <div className="home-error">
          <p>Məhsullar yüklənərkən xəta baş verdi. Səhifəni yeniləyin.</p>
          <button onClick={() => window.location.reload()}>Yenilə</button>
        </div>
      )}

      {/* Toptan kampanyalar */}
      <motion.section
        className="campaign-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <motion.div className="campaign-header" variants={fadeUp}>
          <span className="campaign-tag">Topdan satış</span>
          <h2 className="campaign-title">
            Topdan <em>kampaniyalar</em>
          </h2>
          <p className="campaign-subtitle">
            WhatsApp üzərindən sifariş verin, xüsusi endirimlər və hədiyyələrdən
            yararlanın.
          </p>
        </motion.div>

        <div className="campaign-grid">
          {campaigns.map((c, i) => (
            <motion.div
              key={i}
              className="campaign-card"
              variants={fadeUp}
              custom={i}
            >
              <div className="campaign-icon">{c.icon}</div>
              <div className="campaign-amount">{c.amount}</div>
              <h3 className="campaign-card-title">{c.title}</h3>
              <p className="campaign-card-desc">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="campaign-cta" variants={fadeUp}>
          <a
            href="https://wa.me/994506912230"
            target="_blank"
            rel="noreferrer"
            className="campaign-wp-btn"
          >
            <FiMessageCircle size={18} />
            WhatsApp ilə topdan sifariş ver
          </a>
        </motion.div>
      </motion.section>

      {/* Perakende ürünler */}
      <section className="home-section">
        <motion.div
          className="home-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="home-section-left">
            <span className="home-section-tag">Pərakəndə satış</span>
            <h2 className="home-section-title">Məhsullarımız</h2>
          </div>
          <Link to="/catalog" className="home-see-all">
            Hamısına bax →
          </Link>
        </motion.div>

        {loading ? (
          <div className="home-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="home-skeleton" />
            ))}
          </div>
        ) : (
          <motion.div
            className="home-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {products.slice(0, 4).map((p, i) => (
              <motion.div key={p.id} variants={fadeUp} custom={i}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Why us */}
      <section className="why-section">
        <motion.div
          className="why-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <span className="why-tag">Üstünlüklərimiz</span>
          <h2 className="why-title">
            Niyə <em>bizi</em> seçirsiniz?
          </h2>
        </motion.div>
        <motion.div
          className="why-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          {[
            {
              icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
              title: "Keyfiyyət zəmanəti",
              desc: "5 ölkənin 11 fabrikindən birbaşa tədarük. Orijinal və sertifikatlı məhsullar.",
            },
            {
              icon: (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </>
              ),
              title: "Sürətli çatdırılma",
              desc: "Sifarişiniz 24-48 saat ərzində hazırlanır. Bakı daxili və ölkə üzrə çatdırılma.",
            },
            {
              icon: (
                <>
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </>
              ),
              title: "Geniş çeşid",
              desc: "Dünyanın aparıcı brendlərindən yüzlərlə model. Hər zövqə uyğun seçim.",
            },
            {
              icon: (
                <>
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </>
              ),
              title: "Etibarlı tərəfdaş",
              desc: "10+ firma ilə uğurlu əməkdaşlıq. Biznesinizin böyüməsinə birlikdə nail oluruq.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="why-card"
              variants={fadeUp}
              custom={i}
            >
              <div className="why-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  {card.icon}
                </svg>
              </div>
              <h3 className="why-card-title">{card.title}</h3>
              <p className="why-card-desc">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo-text">AROMA LIFE</div>
            <p className="footer-tagline">Pərakəndə və topdan ətir satışı</p>

            <a
              href="https://maps.google.com/?q=Sədərək+ticarət+mərkəzi"
              target="_blank"
              rel="noreferrer"
              className="footer-address"
            >
              <FiMapPin size={13} />
              Sədərək, sıra 6, mağaza 54
            </a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Keçidlər</span>
            <Link to="/" className="footer-link">
              Ana səhifə
            </Link>
            <Link to="/catalog" className="footer-link">
              Kataloq
            </Link>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Əlaqə</span>
            <a
              href="https://wa.me/994506912230"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              WhatsApp
            </a>
            <a
              href="https://instagram.com/aroma_life_baza"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Instagram
            </a>
            <span className="footer-link">aromalife.az</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AromaLife. Bütün hüquqlar qorunur.</span>
          <span>aromalife.az</span>
        </div>
      </footer>
    </div>
  );
}
