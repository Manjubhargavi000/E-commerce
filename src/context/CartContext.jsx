/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CREATE CONTEXT
//    createContext() gives us a Context object.
//    We export it so the Provider can be used at the app root (App.jsx).
// ─────────────────────────────────────────────────────────────────────────────
const CartContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// 2. CUSTOM HOOK — useCart()
//    Wraps useContext(CartContext) so any component can call useCart()
//    instead of importing both useContext and CartContext.
// ─────────────────────────────────────────────────────────────────────────────
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};

// ─────────────────────────────────────────────────────────────────────────────
// Mock coupon codes  (replace with real API validation)
// ─────────────────────────────────────────────────────────────────────────────
const VALID_COUPONS = {
  SAVE10:  { type: 'percent', value: 10,   label: '10% off'    },
  FLAT200: { type: 'flat',    value: 200,  label: '₹200 off'   },
  FIRST50: { type: 'percent', value: 50,   label: '50% off'    },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROVIDER COMPONENT
//    Holds all cart state and exposes actions via Context value.
//    Wrap your app root with <CartProvider> (already done in App.jsx).
// ─────────────────────────────────────────────────────────────────────────────
export const CartProvider = ({ children }) => {

  // ── State ─────────────────────────────────────────────────────────────────
  const [cart, setCart] = useState(() => {
    // Lazy initialiser — reads localStorage once on first render
    try {
      const saved = localStorage.getItem('fashionhub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon,         setCoupon]         = useState(null);   // applied coupon object | null
  const [couponError,    setCouponError]    = useState('');      // validation error string
  const [couponInput,    setCouponInput]    = useState('');      // controlled input value

  // ── Persist cart to localStorage on every change ──────────────────────────
  useEffect(() => {
    localStorage.setItem('fashionhub_cart', JSON.stringify(cart));
  }, [cart]);

  // ─────────────────────────────────────────────────────────────────────────
  // CART ACTIONS
  // Each action uses the functional setState pattern so we always work
  // from the latest state — avoids stale-closure bugs.
  // ─────────────────────────────────────────────────────────────────────────

  /** Add a product to the cart, or increment its quantity if it's already there */
  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  /** Remove a single line item from the cart */
  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  /** Set an item's quantity directly; removes item if quantity reaches 0 */
  const updateQuantity = useCallback((productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  }, [removeFromCart]);

  /** Empty the entire cart and clear any applied coupon */
  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
    setCouponInput('');
    setCouponError('');
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // COUPON ACTIONS
  // ─────────────────────────────────────────────────────────────────────────

  /** Validate and apply a coupon code */
  const applyCoupon = useCallback((code) => {
    const found = VALID_COUPONS[code.trim().toUpperCase()];
    if (!found) {
      setCouponError('Invalid coupon code. Try SAVE10, FLAT200, or FIRST50.');
      setCoupon(null);
      return false;
    }
    setCoupon({ code: code.trim().toUpperCase(), ...found });
    setCouponError('');
    return true;
  }, []);

  /** Remove the currently applied coupon */
  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponInput('');
    setCouponError('');
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // DERIVED VALUES  (computed from state, not stored)
  // ─────────────────────────────────────────────────────────────────────────

  /** Raw subtotal in USD before any discount */
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  /** Total number of individual units in the cart */
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  /** Discount amount in USD */
  const discountAmount = (() => {
    if (!coupon) return 0;
    if (coupon.type === 'percent') return cartSubtotal * (coupon.value / 100);
    // flat discount (stored in INR equivalent at 82.5 rate, convert back)
    return coupon.value / 82.5;
  })();

  /** Final payable total after discount */
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  /** Delivery threshold: free above ₹5000 equivalent */
  const FREE_DELIVERY_THRESHOLD_USD = 5000 / 82.5;
  const deliveryFree = cartSubtotal >= FREE_DELIVERY_THRESHOLD_USD;

  // ─────────────────────────────────────────────────────────────────────────
  // CONTEXT VALUE — everything consumers can read or call
  // ─────────────────────────────────────────────────────────────────────────
  const value = {
    // State
    cart,
    coupon,
    couponInput,
    couponError,

    // Derived
    cartSubtotal,
    discountAmount,
    cartTotal,
    cartItemCount,
    deliveryFree,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    setCouponInput,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
