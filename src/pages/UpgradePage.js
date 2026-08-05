import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const freeFeatures = [
  '✅ AI Settlement Assistant',
  '✅ Arrival Checklist',
  '✅ Wellbeing Hub',
  '✅ Document Assistant',
  '✅ Transport Guide',
  '✅ Jobs Board',
  '✅ How it Works',
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
  const { user } = useAuth();

  if (user?.is_premium) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>⭐</div>
          <h2 style={styles.title}>You're already Premium!</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7 }}>
            You have full access to all Settle-In Buddy features including buddy matching, chat and accommodation listings.
          </p>
          <button className="btn-primary" style={{ width: '100%', padding: 13 }} onClick={() => navigate('/')}>
            Go to Dashboard →
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
        <p style={styles.headerSub}>Connect with a buddy, chat in real time and find verified accommodation — everything you need to thrive in the UK.</p>
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
        <div style={{ ...styles.planCard, border: '2px solid var(--amber)', boxShadow: '0 8px 30px rgba(245,166,35,0.2)' }}>
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
            <div style={styles.paymentNote}>
              💳 To upgrade, contact your university's international office or email us at <strong>premium@settlebuddy.uk</strong>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '13px', fontSize: 15, background: 'linear-gradient(135deg,var(--amber),#f07020)', boxShadow: '0 4px 14px rgba(245,166,35,0.4)' }}
              onClick={() => window.location.href = 'mailto:premium@settlebuddy.uk?subject=Premium Upgrade Request&body=Hi, I would like to upgrade my Settle-In Buddy account to Premium. My registered email is: ' + user?.email}>
              Request Upgrade →
            </button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={styles.faqSection}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Common Questions
        </h3>
        <div style={styles.faqGrid}>
          {[
            { q: 'How do I pay?', a: 'Send us an email and we will set up payment. We accept card payments via Stripe. Your account is upgraded instantly once payment is confirmed.' },
            { q: 'Can I cancel anytime?', a: 'Yes — cancel anytime with no penalty. Your premium access continues until the end of your billing period.' },
            { q: 'Is there a student discount?', a: 'Yes — students at partner universities get 50% off. Ask your international office if your university is a partner.' },
            { q: 'What if I am not happy?', a: 'We offer a 7-day money-back guarantee on your first month. No questions asked.' },
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
  header: { textAlign: 'center', marginBottom: '2.5rem' },
  headerBadge: { display: 'inline-block', background: 'linear-gradient(135deg,var(--amber),#f07020)', color: '#fff', padding: '6px 18px', borderRadius: 50, fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: '0.5px' },
  headerTitle: { fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', marginBottom: 12, lineHeight: 1.2 },
  headerSub: { fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' },
  plansGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: '1.5rem', marginBottom: '3rem', alignItems: 'start', position: 'relative' },
  planCard: { background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, overflow: 'hidden', position: 'relative' },
  featuredRibbon: { position: 'absolute', top: 16, right: 16, background: '#fff', color: '#f07020', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 50, zIndex: 1 },
  planTop: { padding: '1.5rem', background: 'var(--cream)' },
  planPrice: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 },
  planBody: { padding: '1.25rem' },
  planFeature: { fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' },
  paymentNote: { background: 'var(--amber-light)', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#92600a', lineHeight: 1.6, marginTop: '1rem' },
  faqSection: { marginBottom: '2rem' },
  faqGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: '1rem' },
  title: { fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', marginBottom: 10 },
};