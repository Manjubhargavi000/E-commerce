import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import MenPage from './pages/MenPage';
import WomenPage from './pages/WomenPage';
import KidsPage from './pages/KidsPage';
import SliderPage from './pages/SliderPage';
import BeautyPage from './pages/BeautyPage';
import ElectronicPage from './pages/ElectronicPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <Header />

            <Routes>
              {/* Catalog Listing, Filters & Search */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Navigate to="/" replace />} />

              {/* Category & utility Pages */}
              <Route path="/men" element={<MenPage />} />
              <Route path="/women" element={<WomenPage />} />
              <Route path="/kids" element={<KidsPage />} />
              <Route path="/beauty" element={<BeautyPage />} />
              <Route path="/electronic" element={<ElectronicPage />} />
              <Route path="/slider" element={<SliderPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Product Specifications details */}
              <Route path="/product/:id" element={<ProductDetails />} />

              {/* Shopping cart summary */}
              <Route path="/cart" element={<CartPage />} />

              {/* Settlement forms */}
              <Route path="/checkout" element={<Checkout />} />

              {/* Success screen */}
              <Route path="/success" element={<Success />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
