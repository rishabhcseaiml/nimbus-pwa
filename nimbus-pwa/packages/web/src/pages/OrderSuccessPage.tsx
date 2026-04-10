export default function OrderSuccessPage({ onContinue }: { onContinue: () => void }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f0f, #1a1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ textAlign: 'center', color: 'white', padding: '48px' }}>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎉</div>
        <h1 style={{ fontSize: '36px', margin: '0 0 16px', letterSpacing: '2px' }}>ORDER PLACED!</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', marginBottom: '8px' }}>
          Thank you for shopping at Nimbus Store
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '40px' }}>
          Your order will be delivered within 3-5 business days
        </p>
        <button
          onClick={onContinue}
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px' }}
        >
          CONTINUE SHOPPING →
        </button>
      </div>
    </div>
  );
}