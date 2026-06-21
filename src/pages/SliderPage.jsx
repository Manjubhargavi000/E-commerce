import { useState } from 'react';
import { products } from '../products';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import formatPriceUSDToINR from '../utils/price';

export default function SliderPage() {
  const featured = products.slice(0, 6);
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + featured.length) % featured.length);
  const next = () => setIndex((i) => (i + 1) % featured.length);

  const item = featured[index];

  return (
    <main className="main-content">
      <section className="slider-section" style={{ padding: '40px 5%' }}>
        <h2 className="shop-section-title">Featured Slider</h2>
        <div className="slider-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="slider-nav" onClick={prev} aria-label="Previous">
            <ArrowLeftCircle size={36} />
          </button>

          <div className="slider-item" style={{ flex: 1, display: 'flex', gap: 16, alignItems: 'center' }}>
            <img src={item.image} alt={item.name} style={{ width: 260, height: 260, objectFit: 'cover', borderRadius: 8 }} />
            <div>
              <h3>{item.name}</h3>
              <p style={{ margin: '8px 0' }}>{item.description.slice(0, 120)}...</p>
              <div style={{ marginTop: 8 }}>
                <strong>{formatPriceUSDToINR(item.price)}</strong>
              </div>
              <div style={{ marginTop: 12 }}>
                <Link to={`/product/${item.id}`} className="btn btn-outline">View Details</Link>
              </div>
            </div>
          </div>

          <button className="slider-nav" onClick={next} aria-label="Next">
            <ArrowRightCircle size={36} />
          </button>
        </div>
      </section>
    </main>
  );
}
