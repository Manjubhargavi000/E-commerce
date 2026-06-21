import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Success() {
  const location = useLocation();
  
  // Extract order ID passed from navigation state (with a stable lazy fallback if loaded directly)
  const [orderId] = useState(() => location.state?.orderId || `AL-${Math.floor(10000 + Math.random() * 90000)}-${new Date().getFullYear()}`);

  return (
    <main className="success-content">
      <div className="success-card">
        <div className="success-check-wrapper">
          <div className="checkmark-pulse-bg"></div>
          <CheckCircle className="checkmark-icon" size={64} />
        </div>

        <span className="success-badge">Transaction Authorized</span>
        <h1 className="success-title">Order Complete</h1>
        <p className="success-description">
          Thank you for choosing Auralux. Your acquisition of premium essentials has been processed and secured under Vault authorization.
        </p>

        <div className="success-details-box">
          <div className="detail-row">
            <span>Authorization Code</span>
            <span className="value-code">{orderId}</span>
          </div>
          <div className="detail-row">
            <span>Estimated Delivery</span>
            <span>2 - 4 Business Days</span>
          </div>
        </div>

        <Link to="/" className="btn btn-primary btn-lg continue-btn">
          Continue Curating Collections
        </Link>
      </div>
    </main>
  );
}
