import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  { path: '/accommodations', icon: '🏡', label: 'Accommodations', desc: 'Find your perfect home', color: '#0a5c44', bg: 'linear-gradient(135deg,#0a5c44,#0f7a5a)', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=70' },
  { path: '/transport', icon: '🚌', label: 'Transportation', desc: 'Get around the UK', color: '#1a56db', bg: 'linear-gradient(135deg,#1a56db,#3b82f6)', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=70' },
  { path: '/buddy', icon: '🤝', label: 'Find a Buddy', desc: 'Connect with someone like you', color: '#ff5c3a', bg: 'linear-gradient(135deg,#ff5c3a,#f5a623)', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=70' },
  { path: '/jobs', icon: '💼', label: 'Jobs', desc: 'Start earning in the UK', color: '#7c3aed', bg: 'linear-gradient(135deg,#7c3aed,#a855f7)', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=70' },
  { path: '/how-it-works', icon: '❓', label: 'How it Works', desc: 'Learn about the platform', color: '#0f766e', bg: 'linear-gradient(135deg,#0f766e,#14b8a6)', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=70' },
];

const buddyLinks = [
  { path: '/my-profile', icon: '👤', label: 'My Profile', desc: 'Manage your buddy profile', color: '#0a5c44', bg: 'linear-gradient(135deg,#0a5c44,#0f7a5a)', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=70' },
  { path: '/my-requests', icon: '📬', label: 'Requests', desc: 'Students waiting for you', color: '#ff5c3a', bg: 'linear-gradient(135deg,#ff5c3a,#f5a623)', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=70' },
];

const adminLinks = [
  { path: '/accommodations', icon: '🏡', label: 'Accommodations', desc: 'Manage property listings', color: '#0a5c44', bg: 'linear-gradient(135deg,#0a5c44,#0f7a5a)', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=70' },
  { path: '/users', icon: '👥', label: 'All Users', desc: 'View registered users', color: '#1a56db', bg: 'linear-gradient(135deg,#1a56db,#3b82f6)', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=70' },
  { path: '/register-buddy', icon: '🤝', label: 'Register Buddy', desc: 'Invite new buddies', color: '#ff5c3a', bg: 'linear-gradient(135deg,#ff5c3a,#f5a623)', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=70' },
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickLinks = user?.role === 'buddy' ? buddyLinks
    : user?.role === 'admin' ? adminLinks
    : studentLinks;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      {/* Hero Banner */}
      <div style={styles.hero} className="animate-fade-up">
        <img
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80"
          alt="UK"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🇬🇧 Welcome to the UK</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.4rem', color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
            {greeting()},<br />{user?.name?.split(' ')[0]}!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, maxWidth: 380 }}>
            Everything you need to settle into UK student life — all in one place.
          </p>
        </div>
      </div>

      {/* Quick Access */}
      <div style={{ marginTop: '2rem' }} className="animate-fade-up-delay">
        <div className="section-title">Quick Access</div>
        <div style={styles.cardGrid}>
          {quickLinks.map((q, i) => (
            <div key={q.path} onClick={() => navigate(q.path)}
              style={{ ...styles.featureCard, animationDelay: `${i * 0.08}s` }}
              className="card-hover animate-fade-up">
              <div style={{ ...styles.featureImg, background: q.bg }}>
                <img src={q.img} alt={q.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, mixBlendMode: 'multiply' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 2rem', gap: 16 }}>
                  <div style={{ fontSize: 32 }}>{q.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{q.label}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{q.desc}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.7)', fontSize: 22 }}>→</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info strip for students */}
      {user?.role === 'student' && (
        <div style={styles.infoStrip} className="animate-fade-up-delay-2">
          {[
            { icon: '🏡', text: 'Find verified student housing' },
            { icon: '🤝', text: 'Match with a buddy in 24hrs' },
            { icon: '💼', text: 'Access 1000+ job listings' },
          ].map(item => (
            <div key={item.text} style={styles.infoItem}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  hero: { borderRadius: 24, overflow: 'hidden', position: 'relative', height: 220, marginBottom: 8 },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(6,61,46,0.88) 0%, rgba(10,92,68,0.6) 60%, rgba(255,92,58,0.4) 100%)' },
  heroContent: { position: 'relative', zIndex: 1, padding: '1.75rem 2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', padding: '5px 14px', borderRadius: 50, fontSize: 11, fontWeight: 700, marginBottom: 10, border: '1px solid rgba(255,255,255,0.25)' },
  cardGrid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  featureCard: { borderRadius: 20, overflow: 'hidden', cursor: 'pointer', border: 'none', background: 'transparent', width: '100%' },
  featureImg: { height: 110, position: 'relative', borderRadius: 20, overflow: 'hidden', width: '100%' },
  infoStrip: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: '1.5rem', background: '#fff', borderRadius: 16, padding: '1rem 1.25rem', border: '1px solid var(--border)' },
  infoItem: { display: 'flex', alignItems: 'center', gap: 8 },
};