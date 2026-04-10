import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SignupPage({ onSwitch, onSuccess }: { onSwitch: () => void, onSuccess: () => void }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) return setError('Fill all required fields');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true); setError('');
    try {
      await signup(form.name, form.email, form.password, form.phone);
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const };
  const labelStyle = { color: 'rgba(255,255,255,0.7)', fontSize: '13px', letterSpacing: '1px', display: 'block' as const, marginBottom: '8px' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Georgia', serif" }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🛍️</div>
          <h1 style={{ color: 'white', margin: 0, fontSize: '28px', fontWeight: 'bold', letterSpacing: '2px' }}>NIMBUS</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '8px 0 0', fontSize: '14px', letterSpacing: '1px' }}>STORE</p>
        </div>

        <h2 style={{ color: 'white', margin: '0 0 24px', fontSize: '20px', fontWeight: 'normal' }}>Create account</h2>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            ❌ {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>FULL NAME *</label>
          <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Rishabh Kumar" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>EMAIL *</label>
          <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>PHONE</label>
          <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>PASSWORD *</label>
          <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 6 characters" style={inputStyle} />
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{ width: '100%', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '1px', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '⏳ Creating account...' : 'CREATE ACCOUNT →'}
        </button>

        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          Already have an account?{' '}
          <span onClick={onSwitch} style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: 'bold' }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}