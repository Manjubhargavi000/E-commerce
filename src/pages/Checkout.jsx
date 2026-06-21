import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, ArrowLeft, Truck, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import formatPriceUSDToINR from '../utils/price';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();

  // If cart is empty, redirect user back home
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  // Form Field states
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formatting helpers
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 16);
      const formatted = digitsOnly.match(/.{1,4}/g)?.join(' ') || digitsOnly;
      setForm(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    if (name === 'cardExpiry') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 4);
      let formatted = digitsOnly;
      if (digitsOnly.length > 2) {
        formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
      }
      setForm(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    if (name === 'cardCvc') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 3);
      setForm(prev => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Full Name is required';
    if (!form.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Invalid email address';
    }
    if (!form.address.trim()) errors.address = 'Shipping Address is required';
    if (!form.city.trim()) errors.city = 'City is required';
    if (!form.zip.trim()) errors.zip = 'ZIP / Postal Code is required';
    if (!form.cardName.trim()) errors.cardName = 'Name on card is required';
    if (form.cardNumber.replace(/\s/g, '').length < 16) errors.cardNumber = 'Enter a valid 16-digit card number';
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(form.cardExpiry)) errors.cardExpiry = 'Enter a valid expiry (MM/YY)';
    if (form.cardCvc.length < 3) errors.cardCvc = 'Enter a valid 3-digit CVC';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API Authorization delay
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `AL-${Math.floor(10000 + Math.random() * 90000)}-${new Date().getFullYear()}`;
      clearCart();
      // Pass generated ID to the success page
      navigate('/success', { state: { orderId: generatedId } });
    }, 2000);
  };

  return (
    <main className="checkout-content">
      <div className="checkout-back-link">
        <Link to="/cart" className="back-btn">
          <ArrowLeft size={16} /> Back to Bag
        </Link>
      </div>

      <div className="checkout-layout">
        {/* CHECKOUT FORM */}
        <form onSubmit={handleCheckoutSubmit} className="checkout-form-container">
          <h2 className="checkout-title">Shipping & Settlement</h2>
          <p className="checkout-subtitle">Secure luxury transaction encrypted via AES-256</p>

          <fieldset className="checkout-section">
            <legend className="section-legend"><Truck size={18} /> Shipping Destination</legend>
            <div className="form-group-grid">
              <div className="form-group col-span-2">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleFormChange}
                  className={formErrors.name ? 'error' : ''}
                />
                {formErrors.name && <span className="field-error-msg">{formErrors.name}</span>}
              </div>

              <div className="form-group col-span-2">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  placeholder="jane@auralux.com"
                  value={form.email}
                  onChange={handleFormChange}
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <span className="field-error-msg">{formErrors.email}</span>}
              </div>

              <div className="form-group col-span-2">
                <label htmlFor="address">Address</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address"
                  placeholder="123 Luxury Avenue, Penthouse B"
                  value={form.address}
                  onChange={handleFormChange}
                  className={formErrors.address ? 'error' : ''}
                />
                {formErrors.address && <span className="field-error-msg">{formErrors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city"
                  placeholder="Metropolis"
                  value={form.city}
                  onChange={handleFormChange}
                  className={formErrors.city ? 'error' : ''}
                />
                {formErrors.city && <span className="field-error-msg">{formErrors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="zip">ZIP / Postal Code</label>
                <input 
                  type="text" 
                  id="zip" 
                  name="zip"
                  placeholder="10001"
                  value={form.zip}
                  onChange={handleFormChange}
                  className={formErrors.zip ? 'error' : ''}
                />
                {formErrors.zip && <span className="field-error-msg">{formErrors.zip}</span>}
              </div>
            </div>
          </fieldset>

          <fieldset className="checkout-section">
            <legend className="section-legend"><Lock size={18} /> Payment Information</legend>
            <div className="form-group-grid">
              <div className="form-group col-span-2">
                <label htmlFor="cardName">Cardholder Name</label>
                <input 
                  type="text" 
                  id="cardName" 
                  name="cardName"
                  placeholder="JANE DOE"
                  value={form.cardName}
                  onChange={handleFormChange}
                  className={formErrors.cardName ? 'error' : ''}
                />
                {formErrors.cardName && <span className="field-error-msg">{formErrors.cardName}</span>}
              </div>

              <div className="form-group col-span-2">
                <label htmlFor="cardNumber">Card Number</label>
                <div className="input-with-icon">
                  <CreditCard size={18} className="input-inner-icon" />
                  <input 
                    type="text" 
                    id="cardNumber" 
                    name="cardNumber"
                    placeholder="4111 2222 3333 4444"
                    value={form.cardNumber}
                    onChange={handleFormChange}
                    className={formErrors.cardNumber ? 'error' : ''}
                  />
                </div>
                {formErrors.cardNumber && <span className="field-error-msg">{formErrors.cardNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cardExpiry">Expiration Date</label>
                <input 
                  type="text" 
                  id="cardExpiry" 
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={form.cardExpiry}
                  onChange={handleFormChange}
                  className={formErrors.cardExpiry ? 'error' : ''}
                />
                {formErrors.cardExpiry && <span className="field-error-msg">{formErrors.cardExpiry}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cardCvc">CVC Code</label>
                <input 
                  type="password" 
                  id="cardCvc" 
                  name="cardCvc"
                  placeholder="•••"
                  value={form.cardCvc}
                  onChange={handleFormChange}
                  className={formErrors.cardCvc ? 'error' : ''}
                />
                {formErrors.cardCvc && <span className="field-error-msg">{formErrors.cardCvc}</span>}
              </div>
            </div>
          </fieldset>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg btn-full btn-checkout"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="submit-spinner-wrapper">
                <span className="spinner"></span>
                Authorizing Vault Securely...
              </span>
            ) : (
              `Authorize Settlement of ${formatPriceUSDToINR(cartTotal)}`
            )}
          </button>
        </form>

        {/* SIDE PREVIEW COLUMN */}
        <div className="checkout-summary-container">
          <div className="payment-card-widget">
            <div className="payment-card-chip"></div>
            <div className="payment-card-brand">AURA VAULT</div>
            
            <div className="payment-card-number">
              {form.cardNumber || '•••• •••• •••• ••••'}
            </div>
            
            <div className="payment-card-bottom">
              <div className="card-holder-info">
                <span className="label">CARDHOLDER</span>
                <span className="value">{form.cardName.toUpperCase() || 'JANE DOE'}</span>
              </div>
              <div className="card-expiry-info">
                <span className="label">EXPIRES</span>
                <span className="value">{form.cardExpiry || 'MM/YY'}</span>
              </div>
            </div>
            
            <div className="card-glow-bg"></div>
          </div>

          <div className="summary-card">
            <h3 className="summary-title">Acquisition Overview</h3>
            <div className="summary-items-list">
              {cart.map(item => (
                <div key={item.product.id} className="summary-item-row">
                  <div className="summary-item-img-title">
                    <div className="summary-item-thumbnail">
                      <img src={item.product.image} alt={item.product.name} />
                    </div>
                    <div className="summary-item-meta">
                      <p className="summary-item-name">{item.product.name}</p>
                      <p className="summary-item-qty">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="summary-item-price">{formatPriceUSDToINR(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-total-row">
                <span>Valuation Subtotal</span>
                <span>{formatPriceUSDToINR(cartTotal)}</span>
              </div>
              <div className="summary-total-row">
                <span>Priority Insured Courier</span>
                <span className="free-tag">Complimentary</span>
              </div>
              <div className="divider-dashed"></div>
              <div className="summary-total-row grand-total-row">
                <span>Settlement Value</span>
                <span>{formatPriceUSDToINR(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
