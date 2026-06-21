import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft,
  ShieldCheck, Truck, Tag, X, ChevronRight,
  RotateCcw, CheckCircle,
} from 'lucide-react';

// ── useContext via custom hook ─────────────────────────────────────────────
// This is the Context API pattern:
//   1. CartContext was created with createContext() in CartContext.jsx
//   2. CartProvider wraps the app in App.jsx
//   3. useCart() calls useContext(CartContext) internally
//   4. Any component anywhere in the tree can call useCart() — no prop drilling
import { useCart } from '../context/CartContext';
import formatPriceUSDToINR from '../utils/price';

// ─────────────────────────────────────────────────────────────────────────────
// CartItem row — receives data + action callbacks as props
// ─────────────────────────────────────────────────────────────────────────────
function CartItemRow({ item, onQuantityChange, onRemove }) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.product.id), 280);
  };

  const lineTotal = item.product.price * item.quantity;

  return (
    <div className={`cp-item-row ${removing ? 'cp-item-removing' : ''}`}>
      {/* Product image */}
      <div className="cp-item-img-wrap">
        <Link to={`/product/${item.product.id}`}>
          <img
            src={item.product.image}
            alt={item.product.name}
            className="cp-item-img"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product info */}
      <div className="cp-item-info">
        <Link to={`/product/${item.product.id}`} className="cp-item-name">
          {item.product.name}
        </Link>
        <span className="cp-item-cat">{item.product.subCategory || item.product.category}</span>
        <span className="cp-item-unit-price">{formatPriceUSDToINR(item.product.price)} each</span>
      </div>

      {/* Quantity controls — calls updateQuantity from CartContext */}
      <div className="cp-qty-cell">
        <div className="cp-qty-wrap">
          <button
            className="cp-qty-btn"
            onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={13} />
          </button>
          <span className="cp-qty-val" aria-label={`Quantity: ${item.quantity}`}>
            {item.quantity}
          </span>
          <button
            className="cp-qty-btn"
            onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="cp-price-cell">
        <span className="cp-line-total">{formatPriceUSDToINR(lineTotal)}</span>
      </div>

      {/* Remove button — calls removeFromCart from CartContext */}
      <div className="cp-remove-cell">
        <button
          className="cp-remove-btn"
          onClick={handleRemove}
          aria-label={`Remove ${item.product.name} from cart`}
          title="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CouponInput — isolated component, reads from CartContext via useCart()
// ─────────────────────────────────────────────────────────────────────────────
function CouponInput() {
  // useContext (via useCart hook) — accessing Context API state
  const { coupon, couponInput, couponError, applyCoupon, removeCoupon, setCouponInput } = useCart();

  const handleApply = (e) => {
    e.preventDefault();
    if (couponInput.trim()) applyCoupon(couponInput);
  };

  if (coupon) {
    return (
      <div className="cp-coupon-applied">
        <CheckCircle size={16} className="cp-coupon-ok-icon" />
        <span>
          <strong>{coupon.code}</strong> applied — {coupon.label}
        </span>
        <button className="cp-coupon-remove-btn" onClick={removeCoupon} aria-label="Remove coupon">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <form className="cp-coupon-form" onSubmit={handleApply}>
      <div className="cp-coupon-input-wrap">
        <Tag size={15} className="cp-coupon-icon" />
        <input
          type="text"
          placeholder="Enter coupon code…"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
          className="cp-coupon-input"
          aria-label="Coupon code"
        />
      </div>
      <button
        type="submit"
        className="btn btn-outline cp-coupon-apply-btn"
        disabled={!couponInput.trim()}
      >
        Apply
      </button>
      {couponError && <p className="cp-coupon-error">{couponError}</p>}
      <p className="cp-coupon-hint">Try: SAVE10 · FLAT200 · FIRST50</p>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OrderSummary — reads derived values from CartContext via useCart()
// ─────────────────────────────────────────────────────────────────────────────
function OrderSummary({ itemCount }) {
  // All values come directly from CartContext — no props needed
  const { cartSubtotal, discountAmount, cartTotal, coupon, deliveryFree } = useCart();

  return (
    <div className="cp-summary-card">
      <h3 className="cp-summary-title">Order Summary</h3>

      <div className="cp-summary-rows">
        <div className="cp-summary-row">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>{formatPriceUSDToINR(cartSubtotal)}</span>
        </div>

        {coupon && discountAmount > 0 && (
          <div className="cp-summary-row cp-summary-discount">
            <span>Discount ({coupon.code})</span>
            <span>− {formatPriceUSDToINR(discountAmount)}</span>
          </div>
        )}

        <div className="cp-summary-row">
          <span>Delivery</span>
          <span className={deliveryFree ? 'cp-free-tag' : ''}>
            {deliveryFree ? 'Free' : formatPriceUSDToINR(5 / 82.5)}
          </span>
        </div>

        {!deliveryFree && (
          <div className="cp-delivery-progress-wrap">
            <div className="cp-delivery-progress-bar">
              <div
                className="cp-delivery-progress-fill"
                style={{
                  width: `${Math.min(100, (cartSubtotal / (5000 / 82.5)) * 100)}%`,
                }}
              ></div>
            </div>
            <p className="cp-delivery-hint">
              Add {formatPriceUSDToINR(Math.max(0, (5000 / 82.5) - cartSubtotal))} more for free delivery
            </p>
          </div>
        )}

        <div className="cp-summary-divider"></div>

        <div className="cp-summary-row cp-summary-total">
          <span>Total</span>
          <span>{formatPriceUSDToINR(cartTotal)}</span>
        </div>
      </div>

      <Link to="/checkout" className="btn btn-primary btn-full btn-lg cp-checkout-btn">
        Proceed to Checkout
        <ChevronRight size={18} />
      </Link>

      <div className="cp-trust-row">
        <ShieldCheck size={14} className="cp-trust-icon" />
        <span>256-bit SSL encrypted checkout</span>
      </div>

      {/* Payment method icons */}
      <div className="cp-payment-methods">
        <span className="cp-pay-badge">VISA</span>
        <span className="cp-pay-badge">MC</span>
        <span className="cp-pay-badge">UPI</span>
        <span className="cp-pay-badge">PayPal</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main CartPage
// Demonstrates: Context API, useContext (via useCart), State Management
// ─────────────────────────────────────────────────────────────────────────────
export default function CartPage() {
  /*
   * useCart() is our custom hook that calls useContext(CartContext).
   * This is the recommended Context API pattern — components subscribe
   * to exactly the context values they need without prop drilling.
   */
  const {
    cart,
    cartItemCount,
    updateQuantity,   // state action from CartContext
    removeFromCart,   // state action from CartContext
    clearCart,        // state action from CartContext
  } = useCart();

  // Local UI state (not shared globally — stays in this component)
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  // ── Empty cart view ────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <main className="cp-page">
        <div className="cp-empty">
          <div className="cp-empty-icon">
            <ShoppingBag size={52} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Start exploring!</p>
          <Link to="/" className="btn btn-primary btn-lg">
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  // ── Filled cart view ───────────────────────────────────────────────────
  return (
    <main className="cp-page">

      {/* ── Page header ── */}
      <div className="cp-page-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>

        <div className="cp-header-center">
          <h1 className="cp-page-title">
            <ShoppingBag size={24} />
            Your Cart
          </h1>
          <nav className="cp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} />
            <span>Cart</span>
          </nav>
        </div>

        {/* Clear all button */}
        <div className="cp-header-right">
          {!showClearConfirm ? (
            <button
              className="cp-clear-btn"
              onClick={() => setShowClearConfirm(true)}
              aria-label="Clear all cart items"
            >
              <RotateCcw size={14} />
              Clear all
            </button>
          ) : (
            <div className="cp-clear-confirm">
              <span>Remove all items?</span>
              <button className="cp-clear-confirm-yes" onClick={handleClearCart}>Yes</button>
              <button className="cp-clear-confirm-no" onClick={() => setShowClearConfirm(false)}>No</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="cp-layout">

        {/* LEFT — Cart items list */}
        <div className="cp-items-col">

          {/* Column headers */}
          <div className="cp-col-headers">
            <span className="cp-col-product">Product</span>
            <span className="cp-col-qty">Quantity</span>
            <span className="cp-col-price">Total</span>
            <span className="cp-col-remove"></span>
          </div>

          {/* Cart item rows */}
          <div className="cp-items-list">
            {cart.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onQuantityChange={updateQuantity}   // Context API action passed as prop
                onRemove={removeFromCart}           // Context API action passed as prop
              />
            ))}
          </div>

          {/* Coupon section */}
          <div className="cp-coupon-section">
            <h4 className="cp-coupon-label">
              <Tag size={15} />
              Have a coupon?
            </h4>
            {/* CouponInput reads from CartContext directly via useCart() */}
            <CouponInput />
          </div>

          {/* Delivery banner */}
          <div className="cp-delivery-banner">
            <Truck size={18} className="cp-delivery-banner-icon" />
            <span>Free standard delivery on orders above ₹5,000</span>
          </div>
        </div>

        {/* RIGHT — Order summary */}
        {/* OrderSummary reads all values directly from CartContext */}
        <OrderSummary itemCount={cartItemCount} />
      </div>
    </main>
  );
}
