import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.screen}>
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1600&q=85"
        alt="UK students"
        style={styles.bgImage}
      />

      {/* Gradient overlay */}
      <div style={styles.overlay} />

      {/* Floating nav */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.logoMark}>S</div>
          <span style={styles.logoText}>Settle-In Buddy</span>
        </div>
        <button className="btn-outline" style={styles.navLogin}
          onClick={() => navigate('/login')}>
          Sign In
        </button>
      </nav>

      {/* Hero content */}
      <div style={styles.content}>

        {/* Badge */}
        <div style={styles.badge} className="animate-fade-up">
          🇬🇧 Built for international students in the UK
        </div>

        {/* Headline */}
        <h1 style={styles.headline} className="animate-fade-up-delay">
          Settle In.<br />
          <em style={{ color: '#ff8c6b' }}>Feel at Home.</em><br />
          Thrive.
        </h1>

        {/* Subtext */}
        <p style={styles.subtext} className="animate-fade-up-delay-2">
          Settle-In Buddy connects international students with people who truly understand the journey —
          from finding accommodation and navigating transport, to landing your first UK job.
          You don't have to figure it out alone.
        </p>

        {/* Buttons */}
        <div style={styles.buttons} className="animate-fade-up-delay-2">
          <button className="btn-primary" style={styles.joinBtn}
            onClick={() => navigate('/login?mode=register')}>
            Join Us — It's Free →
          </button>
          <button style={styles.loginBtn}
            onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div style={styles.stats} className="animate-fade-up-delay-2">
          {[
            { num: '500+', label: 'Students settled' },
            { num: '120+', label: 'Active buddies' },
            { num: '50+', label: 'Languages spoken' },
            { num: '20+', label: 'UK universities' },
          ].map(s => (
            <div key={s.label} style={styles.stat}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom cards */}
      <div style={styles.featureStrip}>
        {[
          { icon: '🏡', title: 'Accommodation', desc: 'Find verified student housing near your university' },
          { icon: '🤝', title: 'Buddy Matching', desc: 'Get paired with someone who speaks your language' },
          { icon: '🚌', title: 'Transportation', desc: 'Learn how to get around the UK with ease' },
          { icon: '💼', title: 'Jobs', desc: 'Discover part-time work suited to students' },
        ].map(f => (
          <div key={f.title} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <div style={styles.featureTitle}>{f.title}</div>
            <div style={styles.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  screen: {
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  bgImage: {
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(160deg, rgba(6,40,30,0.92) 0%, rgba(10,92,68,0.78) 40%, rgba(255,92,58,0.35) 100%)',
    zIndex: 1,
  },
  nav: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem 2.5rem',
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Playfair Display',serif",
    fontWeight: 900,
    fontSize: 20,
  },
  logoText: {
    fontFamily: "'Playfair Display',serif",
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.3px',
  },
  navLogin: {
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
    border: '1.5px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: 50,
    padding: '8px 20px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all .2s',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem 1.5rem',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.25)',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: 50,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.5px',
    marginBottom: 24,
  },
  headline: {
    fontFamily: "'Playfair Display',serif",
    fontSize: 'clamp(2.8rem, 7vw, 5rem)',
    color: '#fff',
    lineHeight: 1.15,
    marginBottom: 20,
    textShadow: '0 2px 20px rgba(0,0,0,0.3)',
  },
  subtext: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 16,
    lineHeight: 1.8,
    maxWidth: 540,
    marginBottom: 36,
  },
  buttons: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 56,
  },
  joinBtn: {
    padding: '15px 36px',
    fontSize: 15,
    borderRadius: 50,
    boxShadow: '0 6px 28px rgba(255,92,58,0.5)',
  },
  loginBtn: {
    padding: '13px 32px',
    fontSize: 15,
    borderRadius: 50,
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
    border: '2px solid rgba(255,255,255,0.4)',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all .2s',
  },
  stats: {
    display: 'flex',
    gap: 40,
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '24px 32px',
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.15)',
  },
  stat: { textAlign: 'center' },
  statNum: {
    fontFamily: "'Playfair Display',serif",
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  featureStrip: {
    position: 'relative',
    zIndex: 10,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 0,
    borderTop: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.35)',
    backdropFilter: 'blur(16px)',
  },
  featureCard: {
    padding: '1.5rem',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    transition: 'background .2s',
  },
  featureIcon: { fontSize: '1.6rem', marginBottom: 8 },
  featureTitle: { fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1rem', marginBottom: 4 },
  featureDesc: { fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 },
};