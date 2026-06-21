import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, Sparkles, SlidersHorizontal, Heart } from 'lucide-react';
import { products } from '../products';
import formatPriceUSDToINR from '../utils/price';
import { useCart } from '../context/CartContext';

export default function BeautyPage() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('popular');

  const searchQuery = searchParams.get('search') || '';
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return product.category === 'Beauty' && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low-high') return a.price - b.price;
      if (sortBy === 'price-high-low') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const toggleFavorite = (e, productId) => {
    e.preventDefault();
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return (
    <main className="main-content">
      <section className="hero-banner">
        <div className="hero-glow-blob"></div>
        <div className="hero-content">
          <span className="hero-tagline">
            <Sparkles size={14} className="tag-spark" /> Beauty Essentials
          </span>
          <h1 className="hero-title">Shop Premium Beauty & Self-Care</h1>
          <p className="hero-subtitle">
            Discover beauty essentials, skincare routines, and everyday grooming products curated for your lifestyle.
          </p>
        </div>
        <div className="hero-visual">
          <div className="hero-image-card">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
              alt="Beauty Collection"
              className="hero-card-img"
            />
            <div className="hero-card-overlay">
              <div className="overlay-info">
                <h4>Beauty Favourites</h4>
                <p>Skincare, Glow & Care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shop-section">
        <div className="shop-header">
          <div className="shop-title-wrapper">
            <h2 className="shop-section-title">Beauty Collection</h2>
            <p className="shop-section-subtitle">Showing {filteredProducts.length} beauty items</p>
          </div>

          <div className="shop-controls">
            <div className="sort-wrapper">
              <SlidersHorizontal size={16} className="sort-icon" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="popular">Most Popular</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const isFavorited = favorites.includes(product.id);
              return (
                <div key={product.id} className="product-card">
                  <div className="card-image-wrapper">
                    <img src={product.image} alt={product.name} className="card-image" />
                    <div className="card-image-gradient"></div>
                    <div className="card-actions-overlay">
                      <Link to={`/product/${product.id}`} className="btn btn-secondary btn-sm">
                        View Details
                      </Link>
                    </div>
                    <div className="card-top-actions">
                      <button
                        className={`favorite-btn ${isFavorited ? 'active' : ''}`}
                        onClick={(e) => toggleFavorite(e, product.id)}
                        title="Add to Wishlist"
                      >
                        <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <span className="card-category-tag">{product.subCategory || product.category}</span>
                  </div>

                  <Link to={`/product/${product.id}`} className="card-info">
                    <h3 className="card-title">{product.name}</h3>
                    <div className="card-rating-price">
                      <div className="rating-badge">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>{product.rating}</span>
                        <span className="reviews-count">({product.reviews})</span>
                      </div>
                      <span className="card-price">{formatPriceUSDToINR(product.price)}</span>
                    </div>
                    <p className="card-description-snippet">{product.description.slice(0, 68)}...</p>
                  </Link>

                  <div className="card-footer-action">
                    <button className="btn btn-primary btn-full" onClick={() => addToCart(product)}>
                      Add to Bag
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-results">
            <h3>No beauty items available</h3>
            <p>Try again later or browse other categories.</p>
          </div>
        )}
      </section>
    </main>
  );
}
