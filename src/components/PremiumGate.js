import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PremiumGate({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.is_premium) return children;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Icon */}
        <div style={styles.iconWrap}>
          <span style={{ fontSize: '2.5rem' }}>⭐</span>
        </div>

        <h2 style={styles.title}>Premium Feature</h2>
        <p style={styles.subtitle}>
          This feature is available to Premium members. Upgrade to get access to buddy matching, real-time chat and verified accommodation listings.
        </p>

        {/* What you get */}
        <div style={styles.featuresList}>
          <div style={styles.featuresTitle}>Premium includes everything free, plus:</div>
          {[
            { icon: '🤝', text: 'Find and match with a buddy' },
            { icon: '💬', text: 'Real-time chat with your buddy' },
            { icon: '🏡', text: 'Verified accommodation listings' },
            { icon: '⭐', text: 'Priority buddy matching' },
            { icon: '📬', text: 'Unlimited buddy requests' },
          ].map(f => (
            <div key={f.text} style={styles.feature}>
              <span style={{ fontSize: 16 }}>{f.icon}</span>
              <span style={{ fontSize: 14 }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div style={styles.pricingBox}>
          <div style={styles.price}>£4.99<span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>/month</span></div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>Cancel anytime · No hidden fees</div>
        </div>

        <button className="btn-primary" style={styles.upgradeBtn}
          onClick={() => navigate('/upgrade')}>
          Upgrade to Premium →
        </button>

        <button className="btn-ghost" style={{ width: '100%', fontSize: 13 }}
          onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '1rem' },
  card: { background: '#fff', border: '1px solid var(--border)', borderRadius: 24, padding: '2rem', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-lg)' },
  iconWrap: { width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,var(--amber),#f07020)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' },
  title: { fontFamily: "'Playfair Display',serif", fontSize: '1.7rem', marginBottom: 10 },
  subtitle: { fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' },
  featuresList: { background: 'var(--cream)', borderRadius: 14, padding: '1rem', marginBottom: '1.25rem', textAlign: 'left' },
  featuresTitle: { fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 },
  feature: { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--border)' },
  pricingBox: { background: 'linear-gradient(135deg,var(--green),var(--green-mid))', borderRadius: 14, padding: '1rem', marginBottom: '1.25rem' },
  price: { fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', fontWeight: 900, color: '#fff' },
  upgradeBtn: { width: '100%', padding: '13px', fontSize: 15, marginBottom: 10, background: 'linear-gradient(135deg,var(--amber),#f07020)', boxShadow: '0 4px 14px rgba(245,166,35,0.4)' },
};