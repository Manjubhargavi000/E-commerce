import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Search, ShoppingCart, User, Sun, Moon, Menu, X,
  ChevronDown, Headphones, Shirt, Users, Baby,
  Sparkles, Cpu, Home, Utensils,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { label: 'Home',       path: '/' },
  { label: 'Men',        path: '/men' },
  { label: 'Women',      path: '/women' },
  { label: 'Kids',       path: '/kids' },
  { label: 'Beauty',     path: '/beauty' },
  { label: 'Electronic', path: '/electronic' },
  { label: 'Deals',      path: '/?sort=popular' },
];

const CATEGORY_ICONS = [
  { label: 'Electronics', Icon: Cpu,           path: '/electronic',            color: '#2563eb' },
  { label: 'Fashion',     Icon: Shirt,          path: '/?category=Men',         color: '#7c3aed' },
  { label: 'Women',       Icon: Users,          path: '/women',                 color: '#db2777' },
  { label: 'Kids',        Icon: Baby,           path: '/kids',                  color: '#16a34a' },
  { label: 'Beauty',      Icon: Sparkles,       path: '/beauty',                color: '#ea580c' },
  { label: 'Home',        Icon: Home,           path: '/?category=Home Appliance', color: '#0891b2' },
  { label: 'Audio',       Icon: Headphones,     path: '/electronic',            color: '#9333ea' },
  { label: 'Food',        Icon: Utensils,       path: '/?category=Food',        color: '#ca8a04' },
];

export default function Header() {
  const { cartItemCount } = useCart();
  const navigate          = useNavigate();
  const location          = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Theme ───────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('ss_theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    // Remove both, then add the right one
    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');
    localStorage.setItem('ss_theme', theme);
  }, [theme]);

  // ── Mobile menu ──────────────────────────────────────────────────────────
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Search ───────────────────────────────────────────────────────────────
  const isHome     = location.pathname === '/';
  const urlSearch  = searchParams.get('search') || '';
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  const [q, setQ]  = useState(urlSearch);
  const debounce   = useRef(null);

  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setQ(urlSearch);
  }

  const pushSearch = (val) => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      if (isHome) {
        const p = new URLSearchParams(searchParams);
        val.trim() ? p.set('search', val.trim()) : p.delete('search');
        setSearchParams(p);
      } else {
        navigate(val.trim() ? `/?search=${encodeURIComponent(val.trim())}` : '/');
      }
    }, 280);
  };

  const handleInput = (v) => { setQ(v); pushSearch(v); };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearTimeout(debounce.current);
    const val = q.trim();
    if (isHome) {
      const p = new URLSearchParams(searchParams);
      val ? p.set('search', val) : p.delete('search');
      setSearchParams(p);
    } else {
      navigate(val ? `/?search=${encodeURIComponent(val)}` : '/');
    }
  };

  const clearSearch = () => {
    setQ('');
    clearTimeout(debounce.current);
    if (isHome) { const p = new URLSearchParams(searchParams); p.delete('search'); setSearchParams(p); }
  };

  // Active link
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  return (
    <header className="ss-header">

      {/* ── Top bar ── */}
      <div className="ss-topbar">
        <div className="ss-topbar-inner">

          {/* Brand */}
          <Link to="/" className="ss-brand">
            <div className="ss-brand-icon">
              <span>F</span>
            </div>
            <span className="ss-brand-name">FashionHub</span>
          </Link>

          {/* Search bar */}
          <form className="ss-search-form" onSubmit={handleSubmit} role="search">
            <div className="ss-search-wrap">
              <input
                type="text"
                className="ss-search-input"
                placeholder="Search for products…"
                value={q}
                onChange={(e) => handleInput(e.target.value)}
                aria-label="Search"
              />
              {q && (
                <button type="button" className="ss-search-clear" onClick={clearSearch} aria-label="Clear">
                  <X size={14} />
                </button>
              )}
            </div>
            <button type="submit" className="ss-search-btn" aria-label="Search">
              <Search size={17} />
            </button>
          </form>

          {/* Actions */}
          <div className="ss-actions">
            <Link to="/login" className="ss-action-btn" aria-label="Login">
              <User size={20} />
              <span className="ss-action-label">Login</span>
            </Link>

            <Link to="/cart" className="ss-cart-btn" aria-label={`Cart ${cartItemCount} items`}>
              <ShoppingCart size={22} />
              {cartItemCount > 0 && <span className="ss-cart-badge">{cartItemCount}</span>}
            </Link>

            <button
              className="ss-theme-btn"
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className="ss-mobile-menu-btn"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Nav links row ── */}
      <nav className={`ss-nav ${mobileOpen ? 'ss-nav-open' : ''}`} aria-label="Main navigation">
        <div className="ss-nav-inner">
          {NAV_LINKS.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              className={`ss-nav-link ${isActive(path) && path !== '/?sort=popular' ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}

          {/* Categories dropdown (desktop) */}
          <div className="ss-nav-dropdown">
            <button className="ss-nav-link ss-nav-dropdown-btn">
              Categories <ChevronDown size={14} />
            </button>
            <div className="ss-dropdown-panel">
              {CATEGORY_ICONS.map(({ label, Icon, path, color }) => (
                <Link key={label} to={path} className="ss-dropdown-item" onClick={() => setMobileOpen(false)}>
                  <span className="ss-dropdown-icon" style={{ color }}><Icon size={16} /></span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Category icon strip ── */}
      <div className="ss-cat-strip">
        <div className="ss-cat-strip-inner">
          {CATEGORY_ICONS.map(({ label, Icon, path, color }) => (
            <Link
              key={label}
              to={path}
              className="ss-cat-icon-item"
              onClick={() => setMobileOpen(false)}
            >
              <div className="ss-cat-icon-circle" style={{ background: `${color}18`, color }}>
                <Icon size={20} />
              </div>
              <span className="ss-cat-icon-label">{label}</span>
            </Link>
          ))}
        </div>
      </div>

    </header>
  );
}
