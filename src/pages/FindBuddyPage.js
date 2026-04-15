import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

const avatarColors = [
  'linear-gradient(135deg,#0a5c44,#0f7a5a)',
  'linear-gradient(135deg,#ff5c3a,#f5a623)',
  'linear-gradient(135deg,#1a56db,#3b82f6)',
  'linear-gradient(135deg,#7c3aed,#a855f7)',
  'linear-gradient(135deg,#0f766e,#14b8a6)',
  'linear-gradient(135deg,#be185d,#ec4899)',
  'linear-gradient(135deg,#b45309,#f59e0b)',
];

export default function FindBuddyPage() {
  const { showToast } = useOutletContext();
  const [buddies, setBuddies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState({});

  const load = async (lang = '') => {
    setLoading(true);
    try {
      const res = await axios.get('/api/buddies', { params: lang ? { language: lang } : {} });
      setBuddies(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const request = async (buddyId, buddyName) => {
    setRequesting(r => ({ ...r, [buddyId]: true }));
    try {
      await axios.post(`/api/buddies/${buddyId}/request`);
      showToast(`Request sent to ${buddyName}!`);
    } catch (err) { showToast(err.response?.data?.error || 'Error sending request'); }
    finally { setRequesting(r => ({ ...r, [buddyId]: false })); }
  };

  return (
    <div>
      {/* Header with image */}
      <div style={styles.heroBanner}>
        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&q=80"
          alt="buddies" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: '#fff', marginBottom: 6 }}>Find a Buddy</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Connect with someone who speaks your language and understands your journey</p>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <div style={styles.searchBox}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load(search)}
            placeholder="Search by language e.g. Yoruba, Arabic, Hindi..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent', fontFamily: "'Plus Jakarta Sans',sans-serif" }} />
          {search && <button onClick={() => { setSearch(''); load(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18 }}>✕</button>}
        </div>
        <button className="btn-secondary" onClick={() => load(search)}>Search</button>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '1rem 0' }}>Finding buddies...</p>}

      {!loading && buddies.length === 0 && (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🤝</div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 6 }}>No buddies found</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{search ? `No results for "${search}"` : 'No buddies available yet'}</p>
        </div>
      )}

      <div style={styles.buddyGrid}>
        {buddies.map((b, i) => {
          const initials = b.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          return (
            <div key={b.id} className="card card-hover" style={styles.buddyCard}>
              {/* Card top */}
              <div style={{ ...styles.cardTop, background: avatarColors[i % avatarColors.length] }}>
                <div style={styles.avatar}>{initials}</div>
                <span style={{ ...styles.statusDot, background: b.available ? '#22c55e' : '#f59e0b' }} />
              </div>
              {/* Card body */}
              <div style={styles.cardBody}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: 2 }}>{b.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                  {b.origin} · {b.university}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {(b.languages || []).map(l => (
                    <span key={l} className="badge badge-green">{l}</span>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {b.bio}
                </p>
                {b.available ? (
                  <button className="btn-primary" style={{ width: '100%', padding: '10px' }}
                    onClick={() => request(b.id, b.name)} disabled={requesting[b.id]}>
                    {requesting[b.id] ? 'Sending...' : 'Request this buddy →'}
                  </button>
                ) : (
                  <div style={styles.busyBtn}>Currently Busy</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  heroBanner: { borderRadius: 24, overflow: 'hidden', position: 'relative', height: 180, marginBottom: '1.5rem' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,92,58,0.85) 0%, rgba(10,92,68,0.7) 100%)' },
  heroContent: { position: 'relative', zIndex: 1, padding: '1.5rem 2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' },
  searchWrap: { display: 'flex', gap: 10, marginBottom: '1.5rem', alignItems: 'center' },
  searchBox: { flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '2px solid var(--border)', borderRadius: 50, padding: '10px 18px', boxShadow: 'var(--shadow-sm)' },
  buddyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' },
  buddyCard: { padding: 0, overflow: 'hidden', border: '1px solid var(--border)' },
  cardTop: { height: 90, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0 1.25rem 0' },
  avatar: { width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, transform: 'translateY(30px)', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' },
  statusDot: { width: 14, height: 14, borderRadius: '50%', border: '2px solid #fff', position: 'absolute', bottom: -8, left: 68, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' },
  cardBody: { padding: '2rem 1.25rem 1.25rem' },
  busyBtn: { width: '100%', padding: '10px', background: 'var(--cream-dark)', borderRadius: 50, textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' },
  emptyState: { textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 24, border: '1px solid var(--border)' },
};