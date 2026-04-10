import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const API_BASE = 'http://localhost:5000';

export default function CheckoutPage({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {
  const { user, token } = useAuth();
  const { items, checkout } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const total = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);

  const inputStyle = {
    width: '100%',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 'bold' as const,
    color: '#374151',
    display: 'block' as const,
    marginBottom: '6px',
    letterSpacing: '0.5px'
  };

  const handlePlaceOrder = async () => {
    if (!form.street || !form.city || !form.state || !form.pincode)
      return setError('Please fill all address fields');
    if (!form.phone)
      return setError('Phone number is required');
    setLoading(true); setError('');
    try {
      const res = await checkout();
      if (res?.queued) {
        alert('📦 Order queued! Will be placed when back online.');
        onSuccess();
      } else if (res?.error) {
        setError(res.error);
      } else {
        onSuccess();
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ background: '#111827', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
          ← Back
        </button>
        <h1 style={{ margin: 0, fontSize: '20px' }}>🛒 Checkout</h1>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>

        {/* Left — Form */}
        <div>

          {/* Personal Info */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', color: '#111827' }}>👤 Personal Information</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>FULL NAME *</label>
                <input style={inputStyle} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Rishabh Kumar" />
              </div>
              <div>
                <label style={labelStyle}>PHONE *</label>
                <input style={inputStyle} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={labelStyle}>EMAIL</label>
              <input style={inputStyle} value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
            </div>
          </div>

          {/* Delivery Address */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', color: '#111827' }}>📍 Delivery Address</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>STREET ADDRESS *</label>
              <input style={inputStyle} value={form.street} onChange={e => update('street', e.target.value)} placeholder="House No, Street, Area" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>CITY *</label>
                <input style={inputStyle} value={form.city} onChange={e => update('city', e.target.value)} placeholder="Chandigarh" />
              </div>
              <div>
                <label style={labelStyle}>STATE *</label>
                <input style={inputStyle} value={form.state} onChange={e => update('state', e.target.value)} placeholder="Punjab" />
              </div>
            </div>

            <div style={{ width: '48%' }}>
              <label style={labelStyle}>PINCODE *</label>
              <input style={inputStyle} value={form.pincode} onChange={e => update('pincode', e.target.value)} placeholder="160014" maxLength={6} />
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', color: '#111827' }}>💳 Payment Method</h2>

            {[
              { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when your order arrives' },
              { value: 'upi', label: '📱 UPI Payment', desc: 'GPay, PhonePe, Paytm' },
              { value: 'card', label: '💳 Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
            ].map(opt => (
              <div
                key={opt.value}
                onClick={() => update('paymentMethod', opt.value)}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '10px', border: `2px solid ${form.paymentMethod === opt.value ? '#111827' : '#e5e7eb'}`, marginBottom: '12px', cursor: 'pointer', background: form.paymentMethod === opt.value ? '#f9fafb' : 'white' }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${form.paymentMethod === opt.value ? '#111827' : '#d1d5db'}`, background: form.paymentMethod === opt.value ? '#111827' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {form.paymentMethod === opt.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{opt.label}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{opt.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Order Summary */}
        <div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: '24px' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', color: '#111827' }}>📦 Order Summary</h2>

            {items.map((item: any) => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.title}</div>
                  <div style={{ color: '#6b7280', fontSize: '13px' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: '#111827' }}>₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #111827' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>
                <span>Subtotal</span><span>₹{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>
                <span>Delivery</span><span style={{ color: '#22c55e' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', color: '#111827' }}>
                <span>Total</span><span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginTop: '16px', fontSize: '14px' }}>
                ❌ {error}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={loading || items.length === 0}
              style={{ width: '100%', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #111827, #374151)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '20px', letterSpacing: '0.5px' }}
            >
              {loading ? '⏳ Placing Order...' : `✅ Place Order — ₹${total.toFixed(2)}`}
            </button>

            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '12px' }}>
              🔒 Secure checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}