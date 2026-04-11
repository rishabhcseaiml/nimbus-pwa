import { useEffect, useState } from 'react';
import { useConnectivity } from './hooks/useConnectivity';
import { useCart } from './contexts/CartContext';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

type Page = 'store' | 'login' | 'signup' | 'checkout' | 'success';

export default function App() {
  const { replayQueue, items: cartItems, add, remove } = useCart();
  const { user, logout } = useAuth();
  const online = useConnectivity(() => replayQueue());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [page, setPage] = useState<Page>('store');

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`).then(r => r.json()).then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/products?limit=50`)
      .then(r => r.json())
      .then(data => { setProducts(data.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cartTotal = cartItems.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p: any) =>
        categories.find((c: any) => c._id === p.category && c.slug === selectedCategory)
      );

  const categoryEmojis: Record<string, string> = { shoes: '👟', cricket: '🏏', football: '⚽', clothing: '👕' };

  const getEmoji = (title: string) => {
    if (title.includes('Bat') || title.includes('Cricket') || title.includes('Ball')) return '🏏';
    if (title.includes('Football') || title.includes('Boot') || title.includes('Jersey')) return '⚽';
    if (title.includes('Air Max') || title.includes('Boost') || title.includes('Sneaker') || title.includes('Footwear')) return '👟';
    if (title.includes('T-Shirt') || title.includes('Tracksuit')) return '👕';
    if (title.includes('Jeans') || title.includes('Cargo')) return '👖';
    if (title.includes('Cap')) return '🧢';
    return '📦';
  };

  // Page routing
  if (page === 'login') return <LoginPage onSwitch={() => setPage('signup')} onSuccess={() => setPage('store')} />;
  if (page === 'signup') return <SignupPage onSwitch={() => setPage('login')} onSuccess={() => setPage('store')} />;
  if (page === 'checkout') return <CheckoutPage onBack={() => setPage('store')} onSuccess={() => setPage('success')} />;
  if (page === 'success') return <OrderSuccessPage onContinue={() => setPage('store')} />;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Segoe UI', sans-serif" }}>

      {!online && (
        <div style={{ background: '#ef4444', color: 'white', padding: '10px', textAlign: 'center', fontSize: '14px' }}>
          ⚠️ You are offline. Browsing cached content.
        </div>
      )}

      {/* Header */}
      <div style={{ background: '#111827', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: '22px', letterSpacing: '2px' }}>🛍️ NIMBUS</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>👤 {user.name}</span>
              <button onClick={logout} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => setPage('login')} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
              Login / Signup
            </button>
          )}
          <button
            onClick={() => setShowCart(!showCart)}
            style={{ background: cartItems.length > 0 ? '#7c3aed' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
          >
            🛒 {cartItems.length} — ₹{cartTotal.toFixed(0)}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        {/* Cart Panel */}
        {showCart && (
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>🛒 Your Cart</h2>
              <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
            {cartItems.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>Cart is empty!</p>
            ) : (
              <>
                {cartItems.map((item: any) => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{getEmoji(item.title)} {item.title}</div>
                      <div style={{ color: '#6b7280', fontSize: '13px' }}>₹{item.price} × {item.quantity}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 'bold' }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                      <button onClick={() => remove(item.productId)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '2px solid #111827' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total: ₹{cartTotal.toFixed(0)}</span>
                  <button
                    onClick={() => {
                      if (!user) { setShowCart(false); setPage('login'); return; }
                      setShowCart(false); setPage('checkout');
                    }}
                    style={{ background: '#111827', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}
                  >
                    {user ? 'Proceed to Checkout →' : 'Login to Checkout →'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {['all', ...categories.map((c: any) => c.slug)].map(slug => (
            <button
              key={slug}
              onClick={() => setSelectedCategory(slug)}
              style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', background: selectedCategory === slug ? '#111827' : '#e5e7eb', color: selectedCategory === slug ? 'white' : '#374151', transition: 'all 0.2s' }}
            >
              {slug === 'all' ? '🏪 All' : `${categoryEmojis[slug] || '📦'} ${slug.charAt(0).toUpperCase() + slug.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', fontSize: '18px' }}>⏳ Loading products...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {filteredProducts.map((product: any) => {
              const inCart = cartItems.find((i: any) => i.productId === product._id);
              return (
                <div key={product._id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                  {/* Image */}
                  <div style={{ width: '100%', height: '180px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                    {getEmoji(product.title)}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: '15px', color: '#111827' }}>{product.title}</h3>
                    <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 12px', lineHeight: '1.4' }}>{product.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#111827' }}>₹{product.price.toLocaleString()}</span>
                      <span style={{ fontSize: '12px', color: product.stock < 10 ? '#ef4444' : '#6b7280' }}>
                        {product.stock < 10 ? `⚠️ Only ${product.stock} left` : `✅ In Stock`}
                      </span>
                    </div>
                    {inCart ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '8px 12px' }}>
                        <span style={{ color: '#15803d', fontSize: '13px', fontWeight: 'bold' }}>✅ Added x{inCart.quantity}</span>
                        <button onClick={() => add(product)} style={{ background: '#15803d', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>+ More</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => add(product)}
                        style={{ width: '100%', background: '#111827', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                      >
                        Add to Cart 🛒
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
