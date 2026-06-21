import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  CheckCircle,
  ShieldCheck,
  Heart,
  Sparkles,
  ShoppingBag,
  Truck,
  RotateCcw,
  Package,
  ChevronRight,
  Share2,
  Minus,
  Plus,
  BadgeCheck,
} from 'lucide-react';
import { products } from '../products';
import formatPriceUSDToINR from '../utils/price';
import { useCart } from '../context/CartContext';

// ─── Simulated API fetch (mirrors a real useEffect + fetch pattern) ───────────
function useProductById(id) {
  const [prevId, setPrevId] = useState(id);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (id !== prevId) {
    setPrevId(id);
    setProduct(null);
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    // Simulate network latency (200 ms) — replace with real fetch() call
    const timer = setTimeout(() => {
      const found = products.find((p) => p.id === parseInt(id));
      if (found) {
        setProduct(found);
      } else {
        setError('Product not found');
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [id]);

  return { product, loading, error };
}

// ─── Star rating renderer ─────────────────────────────────────────────────────
function StarRating({ rating, size = 16 }) {
  return (
    <div className="pd-stars" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <Star
            key={star}
            size={size}
            fill={filled || half ? '#fbbf24' : 'none'}
            color={filled || half ? '#fbbf24' : 'var(--border-hover)'}
            style={{ flexShrink: 0 }}
          />
        );
      })}
    </div>
  );
}

// ─── Related Products strip ───────────────────────────────────────────────────
function RelatedProducts({ category, currentId }) {
  const related = products
    .filter((p) => p.category === category && p.id !== currentId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="pd-related">
      <h3 className="pd-related-title">You May Also Like</h3>
      <div className="pd-related-grid">
        {related.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="pd-related-card">
            <div className="pd-related-img-wrap">
              <img src={p.image} alt={p.name} loading="lazy" />
            </div>
            <div className="pd-related-info">
              <p className="pd-related-name">{p.name}</p>
              <div className="pd-related-meta">
                <StarRating rating={p.rating} size={12} />
                <span className="pd-related-price">{formatPriceUSDToINR(p.price)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Main ProductDetails page ─────────────────────────────────────────────────
export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  // useParams + simulated API fetch
  const { product, loading, error } = useProductById(id);

  // Local state
  const [prevId, setPrevId] = useState(id);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [addedFeedback, setAddedFeedback] = useState(false);

  if (id !== prevId) {
    setPrevId(id);
    setQuantity(1);
    setAddedFeedback(false);
  }

  // Reset quantity when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <main className="pd-page">
        <div className="pd-skeleton">
          <div className="pd-skel-img skeleton-pulse"></div>
          <div className="pd-skel-info">
            <div className="skeleton-pulse pd-skel-line" style={{ width: '40%', height: '14px' }}></div>
            <div className="skeleton-pulse pd-skel-line" style={{ width: '80%', height: '28px', marginTop: '12px' }}></div>
            <div className="skeleton-pulse pd-skel-line" style={{ width: '60%', height: '20px', marginTop: '12px' }}></div>
            <div className="skeleton-pulse pd-skel-line" style={{ width: '100%', height: '80px', marginTop: '20px' }}></div>
            <div className="skeleton-pulse pd-skel-line" style={{ width: '100%', height: '48px', marginTop: '32px' }}></div>
          </div>
        </div>
      </main>
    );
  }

  // ── Not found ──
  if (error || !product) {
    return (
      <main className="pd-page">
        <div className="empty-results" style={{ marginTop: '80px' }}>
          <h3>Product Not Found</h3>
          <p>The product you're looking for doesn't exist in our collection.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Back to Store
          </Link>
        </div>
      </main>
    );
  }

  // Derived values
  const originalPrice = product.price * 1.3; // simulate a "was" price
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const tabs = ['description', 'specs', 'features', 'shipping'];

  return (
    <main className="pd-page">

      {/* ── Breadcrumb ── */}
      <nav className="pd-breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="pd-bc-link">Home</Link>
        <ChevronRight size={14} className="pd-bc-sep" />
        <Link to={`/?category=${product.category}`} className="pd-bc-link">{product.category}</Link>
        <ChevronRight size={14} className="pd-bc-sep" />
        <span className="pd-bc-current">{product.name}</span>
      </nav>

      {/* ── Main layout ── */}
      <div className="pd-layout">

        {/* LEFT — Image panel */}
        <div className="pd-image-panel">
          <div className="pd-img-main-wrap">
            <div className="pd-img-bg-blur" style={{ backgroundImage: `url(${product.image})` }} aria-hidden="true"></div>
            <img src={product.image} alt={product.name} className="pd-img-main" />

            {/* Badges */}
            <div className="pd-img-badges">
              <span className="pd-badge pd-badge-discount">-{discount}% OFF</span>
              {product.rating >= 4.8 && (
                <span className="pd-badge pd-badge-top">
                  <BadgeCheck size={12} /> Top Rated
                </span>
              )}
            </div>

            {/* Wishlist on image */}
            <button
              className={`pd-img-fav-btn ${isFavorited ? 'active' : ''}`}
              onClick={() => setIsFavorited((v) => !v)}
              aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Trust signals below image */}
          <div className="pd-trust-row">
            <div className="pd-trust-item">
              <ShieldCheck size={18} className="pd-trust-icon" />
              <span>1 Year Warranty</span>
            </div>
            <div className="pd-trust-item">
              <RotateCcw size={18} className="pd-trust-icon" />
              <span>30-Day Returns</span>
            </div>
            <div className="pd-trust-item">
              <Package size={18} className="pd-trust-icon" />
              <span>Secure Packaging</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Info panel */}
        <div className="pd-info-panel">

          {/* Category + share */}
          <div className="pd-info-top-row">
            <span className="pd-category-label">
              <Sparkles size={12} />
              {product.subCategory || product.category}
            </span>
            <button className="pd-share-btn" aria-label="Share product">
              <Share2 size={16} />
            </button>
          </div>

          {/* Product name */}
          <h1 className="pd-product-title">{product.name}</h1>

          {/* Rating row */}
          <div className="pd-rating-row">
            <StarRating rating={product.rating} />
            <span className="pd-rating-val">{product.rating}</span>
            <span className="pd-rating-count">({product.reviews} reviews)</span>
          </div>

          {/* Price block */}
          <div className="pd-price-block">
            <span className="pd-price-current">{formatPriceUSDToINR(product.price)}</span>
            <span className="pd-price-original">{formatPriceUSDToINR(originalPrice)}</span>
            <span className="pd-price-badge">Save {discount}%</span>
          </div>

          {/* Short description */}
          <p className="pd-short-desc">{product.description}</p>

          {/* Quantity selector */}
          <div className="pd-qty-block">
            <span className="pd-qty-label">Quantity</span>
            <div className="pd-qty-controls">
              <button
                className="pd-qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="pd-qty-val">{quantity}</span>
              <button
                className="pd-qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pd-cta-group">
            <button
              className={`btn btn-primary btn-lg pd-add-btn ${addedFeedback ? 'pd-add-success' : ''}`}
              onClick={handleAddToCart}
            >
              {addedFeedback ? (
                <>
                  <CheckCircle size={18} />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Add to Cart — {formatPriceUSDToINR(product.price * quantity)}
                </>
              )}
            </button>
            <button
              className={`pd-wishlist-btn ${isFavorited ? 'active' : ''}`}
              onClick={() => setIsFavorited((v) => !v)}
              aria-label="Toggle wishlist"
            >
              <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="pd-delivery-info">
            <Truck size={16} className="pd-delivery-icon" />
            <span>Free delivery on orders over ₹5,000 · Estimated 3–5 business days</span>
          </div>

          {/* Tabs: Description / Specs / Features / Shipping */}
          <div className="pd-tabs">
            <div className="pd-tab-list" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={`pd-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="pd-tab-content" role="tabpanel">
              {activeTab === 'description' && (
                <p className="pd-tab-text">{product.description}</p>
              )}

              {activeTab === 'specs' && product.specs && (
                <ul className="pd-specs-list">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <li key={key} className="pd-spec-row">
                      <span className="pd-spec-key">{key}</span>
                      <span className="pd-spec-val">{val}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'features' && product.features && (
                <ul className="pd-features-list">
                  {product.features.map((feat, i) => (
                    <li key={i} className="pd-feature-row">
                      <CheckCircle size={15} className="pd-feature-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'shipping' && (
                <div className="pd-shipping-info">
                  <div className="pd-shipping-row">
                    <Truck size={16} className="pd-trust-icon" />
                    <div>
                      <strong>Standard Delivery</strong>
                      <p>3–5 business days · Free over ₹5,000</p>
                    </div>
                  </div>
                  <div className="pd-shipping-row">
                    <RotateCcw size={16} className="pd-trust-icon" />
                    <div>
                      <strong>Easy Returns</strong>
                      <p>Return within 30 days for a full refund</p>
                    </div>
                  </div>
                  <div className="pd-shipping-row">
                    <ShieldCheck size={16} className="pd-trust-icon" />
                    <div>
                      <strong>Secure Checkout</strong>
                      <p>Your payment information is always encrypted</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Related products ── */}
      <RelatedProducts category={product.category} currentId={product.id} />

    </main>
  );
}
