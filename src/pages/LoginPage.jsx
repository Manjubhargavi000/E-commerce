import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate   = useNavigate();
  const { login }  = useAuth();

  const [tab,          setTab]          = useState('login');   // 'login' | 'signup'
  const [form,         setForm]         = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors,       setErrors]       = useState({});
  const [isLoading,    setIsLoading]    = useState(false);
  const [googleLoading,setGoogleLoading]= useState(false);
  const [success,      setSuccess]      = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (tab === 'signup' && !form.name.trim()) e.name = 'Full name is required.';
    if (!form.email) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters.';
    return e;
  };

  /* ── Email / password sign-in ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    setTimeout(() => {
      const userData = {
        name:   form.name  || form.email.split('@')[0],
        email:  form.email,
        avatar: null,
        method: 'email',
      };
      login(userData);
      setIsLoading(false);
      setSuccess(tab === 'signup' ? 'Account created! Redirecting…' : 'Welcome back! Redirecting…');
      setTimeout(() => navigate('/'), 1000);
    }, 1200);
  };

  /* ── Google sign-in (simulated) ── */
  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    // In production replace with: signInWithPopup(auth, googleProvider)
    setTimeout(() => {
      const googleUser = {
        name:   'Google User',
        email:  'user@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
        method: 'google',
      };
      login(googleUser);
      setGoogleLoading(false);
      setSuccess('Signed in with Google! Redirecting…');
      setTimeout(() => navigate('/'), 800);
    }, 1400);
  };

  return (
    <main className="login-page">
      <div className="login-blob login-blob-1"></div>
      <div className="login-blob login-blob-2"></div>

      <div className="login-wrapper">

        {/* ── Left brand panel ── */}
        <div className="login-brand-panel">
          <div className="login-brand-inner">
            <Link to="/" className="nav-brand" style={{ marginBottom: '40px', display: 'inline-flex' }}>
              <div className="brand-logo-icon"><span className="brand-logo-letter">F</span></div>
              <span className="brand-name">FashionHub</span>
            </Link>
            <h2 className="login-brand-heading">Your style,<br />your world.</h2>
            <p className="login-brand-sub">
              Sign in to unlock exclusive deals, track your orders, and enjoy a personalised shopping experience.
            </p>
            <div className="login-brand-features">
              <div className="login-feature-chip"><ShoppingBag size={14} /><span>Saved Cart</span></div>
              <div className="login-feature-chip"><Sparkles size={14} /><span>Exclusive Offers</span></div>
              <div className="login-feature-chip"><ArrowRight size={14} /><span>Fast Checkout</span></div>
            </div>
          </div>
          <div className="login-brand-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80"
              alt="Fashion"
              className="login-brand-img"
            />
            <div className="login-brand-img-overlay"></div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="login-form-panel">
          <div className="login-form-inner">

            {/* Tab switcher */}
            <div className="login-tabs">
              <button
                className={`login-tab ${tab === 'login' ? 'active' : ''}`}
                onClick={() => { setTab('login'); setErrors({}); setSuccess(''); }}
              >Sign In</button>
              <button
                className={`login-tab ${tab === 'signup' ? 'active' : ''}`}
                onClick={() => { setTab('signup'); setErrors({}); setSuccess(''); }}
              >Create Account</button>
            </div>

            <div className="login-form-header">
              <span className="login-form-tag"><Sparkles size={12} /> {tab === 'login' ? 'Welcome back' : 'Join FashionHub'}</span>
              <h1 className="login-form-title">
                {tab === 'login' ? 'Sign in to FashionHub' : 'Create your account'}
              </h1>
            </div>

            {/* Success banner */}
            {success && (
              <div className="login-success-banner">
                <CheckCircle size={16} /> {success}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>

              {/* Name (signup only) */}
              {tab === 'signup' && (
                <div className={`login-field ${errors.name ? 'has-error' : ''}`}>
                  <label htmlFor="name">Full Name</label>
                  <div className="login-input-wrap">
                    <input
                      type="text" id="name" name="name"
                      placeholder="Your full name"
                      value={form.name} onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && <span className="login-error-msg">{errors.name}</span>}
                </div>
              )}

              {/* Email */}
              <div className={`login-field ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Email address</label>
                <div className="login-input-wrap">
                  <Mail size={16} className="login-input-icon" />
                  <input
                    type="email" id="email" name="email"
                    placeholder="you@example.com"
                    value={form.email} onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className="login-error-msg">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className={`login-field ${errors.password ? 'has-error' : ''}`}>
                <label htmlFor="password">Password</label>
                <div className="login-input-wrap">
                  <Lock size={16} className="login-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password" name="password"
                    placeholder={tab === 'signup' ? 'Choose a password (min 6 chars)' : 'Enter your password'}
                    value={form.password} onChange={handleChange}
                    autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button" className="login-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide' : 'Show'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="login-error-msg">{errors.password}</span>}
              </div>

              {tab === 'login' && (
                <div className="login-options-row">
                  <label className="login-remember">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="login-forgot-btn">Forgot password?</button>
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-primary btn-full login-submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || !!success}
              >
                {isLoading
                  ? <span className="login-spinner"></span>
                  : <>{tab === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
                }
              </button>

              <div className="login-divider"><span>or continue with</span></div>

              {/* Google button — WORKING */}
              <button
                type="button"
                className={`login-google-btn ${googleLoading ? 'loading' : ''}`}
                onClick={handleGoogleSignIn}
                disabled={googleLoading || !!success}
              >
                {googleLoading ? (
                  <span className="login-spinner" style={{ borderTopColor: '#4285f4' }}></span>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <p className="login-switch-text">
                {tab === 'login'
                  ? <>No account? <button type="button" className="login-link-btn" onClick={() => { setTab('signup'); setErrors({}); }}>Create one free</button></>
                  : <>Already have an account? <button type="button" className="login-link-btn" onClick={() => { setTab('login'); setErrors({}); }}>Sign in</button></>
                }
              </p>

            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
