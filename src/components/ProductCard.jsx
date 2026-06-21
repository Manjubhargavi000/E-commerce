import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import formatPriceUSDToINR from '../utils/price';

/**
 * ProductCard component
 * Props:
 *   product     {Object}   - product data object
 *   isFavorited {boolean}  - whether this product is in wishlist
 *   onFavorite  {Function} - called with productId to toggle wishlist
 *   onAddToCart {Function} - called with product to add to cart
 */
export default function ProductCard({ product, isFavorited, onFavorite, onAddToCart }) {
  return (
    <div className="product-card" role="article" aria-label={product.name}>
      {/* Image Area */}
      <div className="card-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="card-image"
          loading="lazy"
        />
        <div className="card-image-gradient" aria-hidden="true"></div>

        {/* Hover overlay – View Details */}
        <div className="card-actions-overlay">
          <Link to={`/product/${product.id}`} className="btn btn-secondary btn-sm">
            View Details
          </Link>
        </div>

        {/* Wishlist button */}
        <div className="card-top-actions">
          <button
            className={`favorite-btn ${isFavorited ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onFavorite(product.id);
            }}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Category tag */}
        <span className="card-category-tag">{product.subCategory || product.category}</span>
      </div>

      {/* Card Info – clickable to detail page */}
      <Link to={`/product/${product.id}`} className="card-info">
        <h3 className="card-title">{product.name}</h3>
        <div className="card-rating-price">
          <div className="rating-badge">
            <Star size={14} fill="#fbbf24" color="#fbbf24" aria-hidden="true" />
            <span>{product.rating}</span>
            <span className="reviews-count">({product.reviews})</span>
          </div>
          <span className="card-price">{formatPriceUSDToINR(product.price)}</span>
        </div>
        <p className="card-description-snippet">
          {product.description.slice(0, 68)}...
        </p>
      </Link>

      {/* Add to Cart */}
      <div className="card-footer-action">
        <button
          className="btn btn-primary btn-full"
          onClick={() => onAddToCart(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={16} />
          Add to Bag
        </button>
      </div>
    </div>
  );
}
