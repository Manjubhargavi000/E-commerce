import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, Sparkles, SlidersHorizontal, Heart } from 'lucide-react';
import { products } from '../products';
import formatPriceUSDToINR from '../utils/price';
import { useCart } from '../context/CartContext';

export default function MenPage() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('popular');

  // Sync state from searchParams
  const searchQuery = searchParams.get('search') || '';
  const selectedSubCategory = searchParams.get('subcategory') || 'All';

  // Men's sub categories
  const menSubCategories = ['All', 'Shirts', 'Pants'];

  // Filtering & Sorting logic - Only show Men products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const isMensProduct = product.category === 'Men';
      const matchesSubCategory = selectedSubCategory === 'All' || product.subCategory === selectedSubCategory;
      return matchesSearch && isMensProduct && matchesSubCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low-high') return a.price - b.price;
      if (sortBy === 'price-high-low') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews; // 'popular'
    });

  const handleSubCategoryChange = (subCat) => {
    const newParams = {};
    if (searchQuery) newParams.search = searchQuery;
    if (subCat !== 'All') newParams.subcategory = subCat;
    setSearchParams(newParams);
  };

  // Toggle favorite
  const toggleFavorite = (e, productId) => {
    e.preventDefault();
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return (
    <main className="main-content">
      {/* HERO BANNER SECTION */}
      <section className="hero-banner">
        <div className="hero-glow-blob"></div>
        <div className="hero-content">
          <span className="hero-tagline">
            <Sparkles size={14} className="tag-spark" /> Premium Men's Collection
          </span>
          <h1 className="hero-title">Discover Premium Men's Fashion</h1>
          <p className="hero-subtitle">
            Explore our curated collection of men's wear including casual shirts, formal attire, and premium pants for every occasion.
          </p>
          <div className="hero-cta-group">
            <a href="#shop-section" className="btn btn-primary btn-lg" onClick={(e) => {
              e.preventDefault();
              document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Shop Now
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-card">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80"
              alt="Men's Fashion Banner"
              className="hero-card-img"
            />
            <div className="hero-card-overlay">
              <div className="overlay-info">
                <h4>Men's Collection</h4>
                <p>Premium Fashion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT CATALOG */}
      <section id="shop-section" className="shop-section">
        <div className="shop-header">
          <div className="shop-title-wrapper">
            <h2 className="shop-section-title">Men's Fashion</h2>
            <p className="shop-section-subtitle">Showing {filteredProducts.length} premium pieces</p>
          </div>

          <div className="shop-controls">
            {/* Subcategories */}
            <div className="subcategories-scroller">
              {menSubCategories.map((subCat) => (
                <button
                  key={subCat}
                  className={`subcategory-pill ${selectedSubCategory === subCat ? 'active' : ''}`}
                  onClick={() => handleSubCategoryChange(subCat)}
                >
                  {subCat}
                </button>
              ))}
            </div>

            {/* Sorting */}
            <div className="sort-wrapper">
              <SlidersHorizontal size={16} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
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

                    <span className="card-category-tag">{product.subCategory}</span>
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
                    <button
                      className="btn btn-primary btn-full"
                      onClick={() => addToCart(product)}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-results">
            <h3>No products found</h3>
            <p>We couldn't find matches for your current filters. Try clearing filters.</p>
            <button
              className="btn btn-outline"
              onClick={() => {
                setSearchParams({});
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
