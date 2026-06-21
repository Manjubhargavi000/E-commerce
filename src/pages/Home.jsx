import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronRight, Star, Heart, ShoppingCart,
  SlidersHorizontal, X as XIcon, ChevronLeft,
  Truck, RefreshCw, ShieldCheck, Headphones,
} from 'lucide-react';
import { products } from '../products';
import formatPriceUSDToINR from '../utils/price';
import { useCart } from '../context/CartContext';
import Pagination from '../components/Pagination';

// ── Constants ──────────────────────────────────────────────────────────────
const PER_PAGE = 12;

const ALL_CATS = ['All','Men','Women','Kids','Beauty','Electronic','Home Appliance','Food'];

const SUB_MAP = {
  Men:        ['All','Shirts','Pants'],
  Women:      ['All','Sarees','Kurti','Dresses','Jeans','Shirts','T-Shirts','Pants','Skirts','Jackets','Ethnic Wear','Activewear'],
  Kids:       ['All','T-Shirts','Shirts','Pants','Dresses','Sets'],
  Beauty:     ['All','Skincare','Makeup','Hair Care','Fragrance'],
  Electronic: ['All','Audio','Accessories','Wearables','Computers','TV & Display','Smart Home'],
};

const SORT_OPTS = [
  { v:'popular',        l:'Popularity' },
  { v:'price-low-high', l:'Price: Low → High' },
  { v:'price-high-low', l:'Price: High → Low' },
  { v:'rating',         l:'Top Rated' },
];

// Hero slides
const SLIDES = [
  {
    bg: 'linear-gradient(135deg,#dbeafe 0%,#bfdbfe 100%)',
    tag: 'New Arrivals',
    title: 'Shop the Best\nProducts Online',
    sub: 'Find everything you need at the best prices.\nFast delivery & easy returns.',
    cta: 'Shop Now',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&auto=format&fit=crop&q=80',
    btnColor: '#2563eb',
  },
  {
    bg: 'linear-gradient(135deg,#fce7f3 0%,#fbcfe8 100%)',
    tag: 'Women\'s Collection',
    title: 'Style That\nSpeaks for You',
    sub: 'Explore the latest women\'s fashion.\nTrends, comfort & elegance combined.',
    cta: 'Explore Now',
    img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&auto=format&fit=crop&q=80',
    btnColor: '#db2777',
  },
  {
    bg: 'linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%)',
    tag: 'Electronics',
    title: 'Top Gadgets\n& Tech Deals',
    sub: 'Headphones, laptops, smart devices.\nAll at unbeatable prices.',
    cta: 'View Deals',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80',
    btnColor: '#059669',
  },
];

// Trust badges
const TRUST = [
  { Icon: Truck,        label: 'Free Delivery',   sub: 'On orders above ₹5,000',  color: '#2563eb' },
  { Icon: RefreshCw,    label: 'Easy Returns',     sub: '30-day hassle-free returns', color: '#16a34a' },
  { Icon: ShieldCheck,  label: 'Secure Payment',   sub: '100% safe & encrypted',   color: '#7c3aed' },
  { Icon: Headphones,   label: '24/7 Support',     sub: 'Always here to help',     color: '#ea580c' },
];

// Category tiles for "Shop by Category"
const CAT_TILES = [
  { label:'Electronics', img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80', path:'/electronic',            bg:'#dbeafe', color:'#1d4ed8' },
  { label:'Fashion',     img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&auto=format&fit=crop&q=80', path:'/men',                    bg:'#ede9fe', color:'#6d28d9' },
  { label:'Home',        img:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&auto=format&fit=crop&q=80', path:'/?category=Home Appliance',bg:'#e0f2fe', color:'#0369a1' },
  { label:'Beauty',      img:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=300&auto=format&fit=crop&q=80', path:'/beauty',                  bg:'#fce7f3', color:'#be185d' },
  { label:'Sports',      img:'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&auto=format&fit=crop&q=80', path:'/kids',                    bg:'#dcfce7', color:'#15803d' },
  { label:'Accessories', img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80', path:'/?category=Fashion',       bg:'#fef9c3', color:'#a16207' },
];

// ── API hook ─────────────────────────────────────────────────────────────
function useProducts() {
  const [data, setData]     = useState([]);
  const [loading, setLoad]  = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setData(products); setLoad(false); }, 280);
    return () => clearTimeout(t);
  }, []);
  return { data, loading };
}

// ── Star row ─────────────────────────────────────────────────────────────
function Stars({ rating, size = 13 }) {
  return (
    <div className="ss-stars">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          fill={rating >= s ? '#f59e0b' : 'none'}
          color={rating >= s ? '#f59e0b' : '#d1d5db'} />
      ))}
      <span className="ss-star-val">({rating})</span>
    </div>
  );
}

// ── Product card (ShopSphere style) ──────────────────────────────────────
function SSCard({ product, isFav, onFav, onCart }) {
  const [added, setAdded] = useState(false);
  const handleCart = () => {
    onCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <div className="ss-card">
      <div className="ss-card-img-wrap">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="ss-card-img" loading="lazy" />
        </Link>
        <button className={`ss-card-fav ${isFav?'active':''}`} onClick={()=>onFav(product.id)} aria-label="Wishlist">
          <Heart size={16} fill={isFav?'currentColor':'none'} />
        </button>
        {product.rating >= 4.8 && <span className="ss-card-badge">Top Rated</span>}
      </div>
      <div className="ss-card-body">
        <p className="ss-card-cat">{product.subCategory || product.category}</p>
        <Link to={`/product/${product.id}`} className="ss-card-name">{product.name}</Link>
        <Stars rating={product.rating} />
        <div className="ss-card-price-row">
          <span className="ss-card-price">{formatPriceUSDToINR(product.price)}</span>
          <span className="ss-card-was">{formatPriceUSDToINR(product.price * 1.25)}</span>
        </div>
        <button className={`ss-card-btn ${added?'ss-card-btn-added':''}`} onClick={handleCart}>
          <ShoppingCart size={15} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

// ── Main Home ─────────────────────────────────────────────────────────────
export default function Home() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [favorites,    setFav]      = useState([]);
  const [sortBy,       setSort]     = useState('popular');
  const [currentPage,  setPage]     = useState(1);
  const [slide,        setSlide]    = useState(0);

  const { data: allProducts, loading } = useProducts();

  const searchQ   = searchParams.get('search')      || '';
  const selCat    = searchParams.get('category')    || 'All';
  const selSub    = searchParams.get('subcategory') || 'All';

  // Render-phase page reset when filters/sorting change
  const [prevFilters, setPrevFilters] = useState({ searchQ, selCat, selSub, sortBy });
  if (
    prevFilters.searchQ !== searchQ ||
    prevFilters.selCat !== selCat ||
    prevFilters.selSub !== selSub ||
    prevFilters.sortBy !== sortBy
  ) {
    setPrevFilters({ searchQ, selCat, selSub, sortBy });
    setPage(1);
  }

  // Auto-advance hero slide
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const filtered = allProducts
    .filter(p => {
      const q = searchQ.toLowerCase();
      const ms = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const mc = selCat === 'All' || p.category === selCat;
      const ms2= selSub === 'All' || p.subCategory === selSub;
      return ms && mc && ms2;
    })
    .sort((a,b) => {
      if (sortBy==='price-low-high') return a.price - b.price;
      if (sortBy==='price-high-low') return b.price - a.price;
      if (sortBy==='rating')         return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const start      = (Math.min(currentPage, totalPages) - 1) * PER_PAGE;
  const paged      = filtered.slice(start, start + PER_PAGE);

  const isFiltering = searchQ || selCat !== 'All' || selSub !== 'All';
  const featured    = [...allProducts].sort((a,b)=>b.reviews-a.reviews).slice(0,6);

  const setSearch = val => {
    const p = {}; if(val) p.search=val; if(selCat!=='All') p.category=selCat; if(selSub!=='All') p.subcategory=selSub; setSearchParams(p);
  };
  const setCat = cat => {
    const p = {}; if(searchQ) p.search=searchQ; if(cat!=='All') p.category=cat; setSearchParams(p);
  };
  const setSub = sub => {
    const p = {}; if(searchQ) p.search=searchQ; if(selCat!=='All') p.category=selCat; if(sub!=='All') p.subcategory=sub; setSearchParams(p);
  };
  const resetAll = () => { setSort('popular'); setSearchParams({}); };

  const toggleFav = id => setFav(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);

  const scrollShop = () => document.getElementById('products-section')?.scrollIntoView({ behavior:'smooth' });

  return (
    <main className="ss-page">

      {/* ══════════════ HERO SLIDER ══════════════ */}
      <section className="ss-hero" style={{ background: SLIDES[slide].bg }}>
        <div className="ss-hero-inner">
          <div className="ss-hero-content">
            <span className="ss-hero-tag" style={{ background: SLIDES[slide].btnColor + '18', color: SLIDES[slide].btnColor }}>
              {SLIDES[slide].tag}
            </span>
            <h1 className="ss-hero-title">{SLIDES[slide].title}</h1>
            <p className="ss-hero-sub">{SLIDES[slide].sub}</p>
            <button className="ss-hero-btn" style={{ background: SLIDES[slide].btnColor }} onClick={scrollShop}>
              {SLIDES[slide].cta}
            </button>
          </div>
          <div className="ss-hero-img-wrap">
            {SLIDES.map((s, i) => (
              <img key={i} src={s.img} alt={s.title} className={`ss-hero-img ${i === slide ? 'active' : ''}`} />
            ))}
          </div>
        </div>

        {/* Slide controls */}
        <div className="ss-hero-dots">
          {SLIDES.map((_, i) => (
            <button key={i} className={`ss-dot ${i===slide?'active':''}`} onClick={()=>setSlide(i)} aria-label={`Slide ${i+1}`} />
          ))}
        </div>
        <button className="ss-slide-arrow ss-slide-prev" onClick={()=>setSlide(s=>(s-1+SLIDES.length)%SLIDES.length)}>
          <ChevronLeft size={20} />
        </button>
        <button className="ss-slide-arrow ss-slide-next" onClick={()=>setSlide(s=>(s+1)%SLIDES.length)}>
          <ChevronRight size={20} />
        </button>
      </section>

      {/* ══════════════ TRUST BADGES ══════════════ */}
      <section className="ss-trust">
        {TRUST.map(({ Icon, label, sub, color }) => (
          <div key={label} className="ss-trust-item">
            <div className="ss-trust-icon" style={{ color, background: color + '18' }}>
              <Icon size={22} />
            </div>
            <div>
              <p className="ss-trust-label">{label}</p>
              <p className="ss-trust-sub">{sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ══════════════ SHOP BY CATEGORY ══════════════ */}
      <section className="ss-section">
        <div className="ss-section-head">
          <div>
            <h2 className="ss-section-title">Shop by Category</h2>
            <p className="ss-section-sub">Find what you're looking for</p>
          </div>
          <button className="ss-view-all" onClick={scrollShop}>View All <ChevronRight size={14} /></button>
        </div>
        <div className="ss-cats-grid">
          {CAT_TILES.map(({ label, img, path, bg, color }) => (
            <Link key={label} to={path} className="ss-cat-tile">
              <div className="ss-cat-tile-img" style={{ background: bg }}>
                <img src={img} alt={label} loading="lazy" />
              </div>
              <p className="ss-cat-tile-label" style={{ color }}>{label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
      {!isFiltering && !loading && (
        <section className="ss-section">
          <div className="ss-section-head">
            <div>
              <h2 className="ss-section-title">Featured Products</h2>
              <p className="ss-section-sub">Top picks for you</p>
            </div>
            <button className="ss-view-all" onClick={scrollShop}>View All <ChevronRight size={14} /></button>
          </div>
          <div className="ss-products-grid">
            {featured.map(p => (
              <SSCard key={p.id} product={p} isFav={favorites.includes(p.id)} onFav={toggleFav} onCart={addToCart} />
            ))}
          </div>
        </section>
      )}

      {/* ══════════════ ALL PRODUCTS ══════════════ */}
      <section id="products-section" className="ss-section ss-products-section">
        <div className="ss-section-head">
          <div>
            <h2 className="ss-section-title">All Products</h2>
            <p className="ss-section-sub">
              {loading ? 'Loading…'
                : filtered.length === 0 ? 'No products found'
                : `Showing ${start+1}–${Math.min(start+PER_PAGE, filtered.length)} of ${filtered.length}`}
            </p>
          </div>
          <div className="ss-sort-wrap">
            <SlidersHorizontal size={15} />
            <select value={sortBy} onChange={e=>setSort(e.target.value)} className="ss-sort-select">
              {SORT_OPTS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </div>
        </div>

        <div className="ss-catalog-layout">
          {/* ── Left sidebar filters ── */}
          <aside className="ss-sidebar">
            <div className="ss-filter-block">
              <h4 className="ss-filter-title">Categories</h4>
              <ul className="ss-filter-list">
                {ALL_CATS.map(cat => (
                  <li key={cat}>
                    <button
                      className={`ss-filter-item ${selCat===cat?'active':''}`}
                      onClick={()=>setCat(cat)}
                    >{cat}</button>
                  </li>
                ))}
              </ul>
            </div>

            {SUB_MAP[selCat] && (
              <div className="ss-filter-block">
                <h4 className="ss-filter-title">Sub-category</h4>
                <ul className="ss-filter-list">
                  {SUB_MAP[selCat].map(s => (
                    <li key={s}>
                      <button
                        className={`ss-filter-item ${selSub===s?'active':''}`}
                        onClick={()=>setSub(s)}
                      >{s}</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="ss-filter-block">
              <h4 className="ss-filter-title">Sort By</h4>
              <ul className="ss-filter-list">
                {SORT_OPTS.map(o=>(
                  <li key={o.v}>
                    <button className={`ss-filter-item ${sortBy===o.v?'active':''}`} onClick={()=>setSort(o.v)}>{o.l}</button>
                  </li>
                ))}
              </ul>
            </div>

            {(searchQ || selCat!=='All' || selSub!=='All' || sortBy!=='popular') && (
              <button className="ss-reset-btn" onClick={resetAll}>
                <XIcon size={14} /> Reset Filters
              </button>
            )}
          </aside>

          {/* ── Products grid ── */}
          <div className="ss-products-col">
            {/* Active filter chips */}
            {(searchQ || selCat!=='All' || selSub!=='All') && (
              <div className="ss-active-chips">
                {searchQ && <span className="ss-chip">"{searchQ}" <button onClick={()=>setSearch('')}><XIcon size={11}/></button></span>}
                {selCat!=='All' && <span className="ss-chip">{selCat} <button onClick={()=>setCat('All')}><XIcon size={11}/></button></span>}
                {selSub!=='All' && <span className="ss-chip">{selSub} <button onClick={()=>setSub('All')}><XIcon size={11}/></button></span>}
                <button className="ss-clear-all" onClick={resetAll}>Clear all</button>
              </div>
            )}

            {/* Skeletons */}
            {loading && (
              <div className="ss-products-grid">
                {Array.from({length:8}).map((_,i)=>(
                  <div key={i} className="ss-card ss-card-skel">
                    <div className="skeleton-pulse" style={{width:'100%',paddingTop:'80%'}}></div>
                    <div style={{padding:'14px',display:'flex',flexDirection:'column',gap:'8px'}}>
                      <div className="skeleton-pulse" style={{height:'12px',width:'50%',borderRadius:'4px'}}></div>
                      <div className="skeleton-pulse" style={{height:'16px',width:'80%',borderRadius:'4px'}}></div>
                      <div className="skeleton-pulse" style={{height:'36px',width:'100%',borderRadius:'6px',marginTop:'4px'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && paged.length > 0 && (
              <div className="ss-products-grid">
                {paged.map(p=>(
                  <SSCard key={p.id} product={p} isFav={favorites.includes(p.id)} onFav={toggleFav} onCart={addToCart} />
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="ss-empty">
                <ShoppingCart size={48} />
                <h3>No products found</h3>
                <p>Try a different search term or remove filters.</p>
                <button className="ss-hero-btn" style={{background:'#2563eb',marginTop:'12px'}} onClick={resetAll}>Reset</button>
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <Pagination
                currentPage={Math.min(currentPage, totalPages)}
                totalPages={totalPages}
                onPageChange={p => { setPage(p); document.getElementById('products-section')?.scrollIntoView({behavior:'smooth'}); }}
              />
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
