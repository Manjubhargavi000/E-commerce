import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-site">
      <div className="footer-top-details">
        <div className="footer-brand-info">
          <span className="footer-brand-name">mantra</span>
          <p className="footer-brand-desc">Curating curated fashion, mobile, beauty and home essentials for modern lifestyles.</p>
        </div>
        <div className="footer-links-grid">
          <div className="footer-links-col">
            <h4>Collection</h4>
            <ul>
              <li><Link to="/?category=All">All Products</Link></li>
              <li><Link to="/?category=Audio">Audio</Link></li>
              <li><Link to="/?category=Workspace">Workspace</Link></li>
              <li><Link to="/?category=Home%20Decor">Home Decor</Link></li>
            </ul>
          </div>
          <div className="footer-links-col">
            <h4>Assurance</h4>
            <ul>
              <li>Insured Logistics</li>
              <li>Vault Transaction Security</li>
              <li>Refund Policy</li>
              <li>Authenticity Guarantee</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom-copy">
        <p>© {new Date().getFullYear()} mantra. All rights reserved.</p>
      </div>
    </footer>
  );
}
