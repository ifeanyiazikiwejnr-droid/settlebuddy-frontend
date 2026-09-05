import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const freeFeatures = [
  '✅ AI Settlement Assistant',
  '✅ Arrival Checklist',
  '✅ Compliance Planner',
  '✅ Wellbeing Hub',
  '✅ Document Assistant',
  '✅ Transport Guide',
  '✅ Jobs Board',
];

const premiumFeatures = [
  '⭐ Everything in Free',
  '🤝 Find & match with a buddy',
  '💬 Real-time chat with buddy',
  '🏡 Verified accommodation listings',
  '⭐ Priority buddy matching',
  '📬 Unlimited buddy requests',
  '🔔 Premium support',
];

export default function UpgradePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState('');
  const success = searchParams.get('success');
  const cancelled = searchParams.get('cancelled');

  // Refresh user data after successful payment
  useEffect(() => {
    if (success) {
      // Re-fetch user to get updated premium status
      axios.get('/api/auth/me').then(res => {
        if (res.data.user) {
          const stored = JSON.parse(localStorage.getItem('sib_user') || '{}');
          const updated = { ...stored, is_premium: true };
          localStorage.setItem('sib_user', JSON.stringify(updated));
        }
      }).catch(() => {});
    }
  }, [success]);

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/stripe/create-checkout');
      window.location.href = res.data.url;
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await axios.post('/api/stripe/create-portal');
      window.location.href = res.data.url;
    } catch (err) {
      setError('Could not open billing portal. Please try again.');
      setPortalLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
          <h2 style={styles.title}>Welcome to Premium!</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
            Your payment was successful. You now have full access to buddy matching, real-time chat and verified accommodations.
          </p>
          <div style={styles.premiumBadgeBox}>
            <span style={{ fontSize: '1.5rem' }}>⭐</span>
            <div>
              <div style={{ fontWeight: 700, color: '#f07020' }}>Premium Member</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>£4.99/month · Cancel anytime</div>
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: 13, marginBottom: 10 }}
            onClick={() => navigate('/buddy')}>
            Find a Buddy →
          </button>
          <button className="btn-outline" style={{ width: '100%', padding: 11 }}
            onClick={() => navigate('/')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Already premium screen
  if (user?.is_premium) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>⭐</div>
          <h2 style={styles.title}>You're Premium!</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>
            You have full access to all Settle-In Buddy features including buddy matching, chat and accommodation listings.
          </p>
          <div style={styles.premiumBadgeBox}>
            <span style={{ fontSize: '1.5rem' }}>⭐</span>
            <div>
              <div style={{ fontWeight: 700, color: '#f07020' }}>Active Premium</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>£4.99/month</div>
            </div>
          </div>
          {error && <div style={styles.errorBox}>{error}</div>}
          <button className="btn-primary" style={{ width: '100%', padding: 13, marginBottom: 10 }}
            onClick={handleManageBilling} disabled={portalLoading}>
            {portalLoading ? 'Opening...' : '⚙️ Manage Billing & Cancel'}
          </button>
          <button className="btn-outline" style={{ width: '100%', padding: 11 }}
            onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerBadge}>⭐ Upgrade to Premium</div>
        <h1 style={styles.headerTitle}>Get the full Settle-In Buddy experience</h1>
        <p style={styles.headerSub}>
          Connect with a buddy, chat in real time and find verified accommodation — everything you need to thrive in the UK.
        </p>
        {cancelled && (
          <div style={styles.cancelledBox}>
            Payment cancelled — no charge was made. You can try again any time.
          </div>
        )}
      </div>

      {/* Plans */}
      <div style={styles.plansGrid}>
        {/* Free */}
        <div style={styles.planCard}>
          <div style={styles.planTop}>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 4 }}>Free</div>
            <div style={styles.planPrice}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontWeight: 900 }}>£0</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>/month</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Get started with the essentials</div>
          </div>
          <div style={styles.planBody}>
            {freeFeatures.map(f => (
              <div key={f} style={styles.planFeature}>{f}</div>
            ))}
            <button className="btn-outline" style={{ width: '100%', marginTop: '1.5rem', padding: '12px' }}
              onClick={() => navigate('/')}>
              Current Plan
            </button>
          </div>
        </div>

        {/* Premium */}
        <div style={{ ...styles.planCard, border: '2px solid #f5a623', boxShadow: '0 8px 30px rgba(245,166,35,0.2)' }}>
          <div style={styles.featuredRibbon}>Most Popular</div>
          <div style={{ ...styles.planTop, background: 'linear-gradient(135deg,#f5a623,#f07020)' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>Premium</div>
            <div style={styles.planPrice}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>£4.99</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>/month</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Full access to everything</div>
          </div>
          <div style={styles.planBody}>
            {premiumFeatures.map(f => (
              <div key={f} style={{ ...styles.planFeature, color: 'var(--text)', fontWeight: f.startsWith('⭐') ? 600 : 400 }}>{f}</div>
            ))}
            {error && <div style={styles.errorBox}>{error}</div>}
            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '1rem', padding: '14px', fontSize: 15, background: 'linear-gradient(135deg,#f5a623,#f07020)', boxShadow: '0 4px 14px rgba(245,166,35,0.4)' }}
              onClick={handleUpgrade}
              disabled={loading}>
              {loading ? '⏳ Redirecting to payment...' : '⭐ Upgrade Now — £4.99/mo'}
            </button>
            <div style={styles.stripeNote}>
              🔒 Secure payment via Stripe · Cancel anytime
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div style={styles.trustRow}>
        {['🔒 Secure Stripe payments', '↩️ Cancel anytime', '7-day money back guarantee', '💳 Card payments only'].map(t => (
          <div key={t} style={styles.trustBadge}>{t}</div>
        ))}
      </div>

      {/* FAQ */}
      <div style={styles.faqSection}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Common Questions
        </h3>
        <div style={styles.faqGrid}>
          {[
            { q: 'How do I pay?', a: 'Click Upgrade Now and you\'ll be taken to a secure Stripe checkout page. We accept Visa, Mastercard, Amex and Apple Pay.' },
            { q: 'Can I cancel anytime?', a: 'Yes — click Manage Billing above to cancel. Your premium access continues until the end of your billing period.' },
            { q: 'Is my card secure?', a: 'Yes — we use Stripe for all payments. Your card details are never stored on our servers — only Stripe handles them.' },
            { q: 'What if I am not happy?', a: 'We offer a 7-day money-back guarantee on your first month. Email us at premium@settlebuddy.uk and we\'ll refund you immediately.' },
          ].map(f => (
            <div key={f.q} className="card" style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: 'var(--green)' }}>{f.q}</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 800, margin: '0 auto' },
  center: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '1rem' },
  card: { background: '#fff', border: '1px solid var(--border)', borderRadius: 24, padding: '2rem', maxWidth: 420, width: '100%', textAlign: 'center' },
  title: { fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', marginBottom: 10 },
  premiumBadgeBox: { display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg,#fff8ec,#fff3dc)', border: '1px solid #f5a623', borderRadius: 14, padding: '12px 16px', marginBottom: 20, textAlign: 'left' },
  errorBox: { background: '#fff1f0', border: '1px solid #ffc9c9', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#c92a2a', marginBottom: 12 },
  header: { textAlign: 'center', marginBottom: '2.5rem' },
  headerBadge: { display: 'inline-block', background: 'linear-gradient(135deg,#f5a623,#f07020)', color: '#fff', padding: '6px 18px', borderRadius: 50, fontSize: 12, fontWeight: 700, marginBottom: 16 },
  headerTitle: { fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', marginBottom: 12, lineHeight: 1.2 },
  headerSub: { fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' },
  cancelledBox: { background: 'var(--amber-light)', border: '1px solid var(--amber)', borderRadius: 12, padding: '10px 16px', fontSize: 13, color: '#92600a', marginTop: 16 },
  plansGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: '1.5rem', marginBottom: '2rem', alignItems: 'start' },
  planCard: { background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, overflow: 'hidden', position: 'relative' },
  featuredRibbon: { position: 'absolute', top: 16, right: 16, background: '#fff', color: '#f07020', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 50, zIndex: 1 },
  planTop: { padding: '1.5rem', background: 'var(--cream)' },
  planPrice: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 },
  planBody: { padding: '1.25rem' },
  planFeature: { fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' },
  stripeNote: { fontSize: 11, color: 'var(--text-faint)', textAlign: 'center', marginTop: 10 },
  trustRow: { display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: '2.5rem' },
  trustBadge: { background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 50, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' },
  faqSection: { marginBottom: '2rem' },
  faqGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: '1rem' },
};