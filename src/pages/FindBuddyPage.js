import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext, useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import useConfirm from '../hooks/useConfirm';

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
  const navigate = useNavigate();
  const [buddies, setBuddies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState({});
  const [myStatus, setMyStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const { modal, confirm } = useConfirm();

  const loadStatus = async () => {
    try {
      const res = await axios.get('/api/buddies/my-buddy-status');
      setMyStatus(res.data);
    } catch {}
    finally { setStatusLoading(false); }
  };

  const load = async (lang = '') => {
    setLoading(true);
    try {
      const res = await axios.get('/api/buddies', { params: lang ? { language: lang } : {} });
      setBuddies(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); loadStatus(); }, []);

  const unmatch = async () => {
    const ok = await confirm({
      title: 'Unmatch Buddy',
      message: `Are you sure you want to unmatch? You will lose your current buddy and your chat history. You can request a new buddy afterwards.`,
      confirmText: 'Unmatch',
      cancelText: 'Keep my buddy',
      danger: true,
    });
    if (!ok) return;
    try {
      await axios.delete('/api/buddies/unmatch');
      showToast('Unmatched successfully');
      setMyStatus(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.error || 'Error unmatching');
    }
  };

  const request = async (buddyId, buddyName) => {
    setRequesting(r => ({ ...r, [buddyId]: true }));
    try {
      await axios.post(`/api/buddies/${buddyId}/request`);
      showToast(`Request sent to ${buddyName}!`);
      loadStatus();
    } catch (err) {
      showToast(err.response?.data?.error || 'Error sending request');
    } finally { setRequesting(r => ({ ...r, [buddyId]: false })); }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>

      {/* Header */}
      <div style={styles.heroBanner}>
        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&q=80"
          alt="buddies" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.4rem,4vw,2rem)', color: '#fff', marginBottom: 6 }}>
            Find a Buddy
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.5 }}>
            Connect with someone who speaks your language and understands your journey
          </p>
        </div>
      </div>

      {/* Current buddy status banner */}
      {!statusLoading && myStatus && (
        <div style={{
          ...styles.statusBanner,
          background: myStatus.status === 'accepted' ? 'var(--green-light)' : 'var(--amber-light)',
          borderColor: myStatus.status === 'accepted' ? '#9FE1CB' : '#f5a623',
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>
              {myStatus.status === 'accepted' ? '🤝' : '⏳'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {myStatus.status === 'accepted' ? (
                <>
                  <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: 14, marginBottom: 2 }}>
                    Matched with {myStatus.buddy_name}!
                  </div>
                  <div style={{ fontSize: 12, color: '#085041', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {myStatus.university} · {myStatus.origin}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, color: '#92600a', fontSize: 14, marginBottom: 2 }}>
                    Request pending
                  </div>
                  <div style={{ fontSize: 12, color: '#78500a' }}>
                    Waiting for {myStatus.buddy_name} to accept
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Languages */}
          {myStatus.status === 'accepted' && (myStatus.languages || []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {(myStatus.languages || []).map(l => (
                <span key={l} className="badge badge-teal">{l}</span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          {myStatus.status === 'accepted' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {myStatus.conversation_id && (
                <button className="btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: 13, minHeight: 44 }}
                  onClick={() => navigate('/chat')}>
                  💬 Chat
                </button>
              )}
              <button style={{ ...styles.unmatchBtn, flex: 1 }} onClick={unmatch}>
                Unmatch
              </button>
            </div>
          )}
        </div>
      )}

      {/* Block searching if already matched or pending */}
      {!statusLoading && myStatus ? (
        <div style={styles.blockedNote}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>
            {myStatus.status === 'accepted' ? '✅' : '⏳'}
          </div>
          <p style={{ fontWeight: 600, marginBottom: 4, fontSize: 15 }}>
            {myStatus.status === 'accepted'
              ? 'You already have an active buddy'
              : 'You have a pending request'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
            {myStatus.status === 'accepted'
              ? `You are currently matched with ${myStatus.buddy_name}. You can only have one buddy at a time.`
              : `Your request to ${myStatus.buddy_name} is pending. You cannot request another buddy until this is resolved.`}
          </p>
          {myStatus.status === 'accepted' && (
            <button style={{ ...styles.unmatchBtn, width: '100%' }} onClick={unmatch}>
              Unmatch from {myStatus.buddy_name}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Search */}
            <div style={styles.searchWrap}>
              <div style={styles.searchBox}>
                <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1 }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && load(search)}
                  placeholder="Search by language..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: 16,
                    background: 'transparent',
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    minWidth: 0,
                    width: '100%',
                  }}
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); load(''); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16, flexShrink: 0, padding: 4, lineHeight: 1, minWidth: 28, minHeight: 28 }}>
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={() => load(search)}
                style={{
                  flexShrink: 0,
                  padding: '11px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  minHeight: 44,
                  background: 'var(--green)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 50,
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  whiteSpace: 'nowrap',
                }}>
                Search
              </button>
            </div>

          {loading && (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '1rem 0' }}>
              Finding buddies...
            </p>
          )}

          {!loading && buddies.length === 0 && (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🤝</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 6 }}>No buddies found</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                {search ? `No results for "${search}"` : 'No buddies available yet'}
              </p>
            </div>
          )}

          {/* Buddy grid — single column on mobile, 2 col on wider screens */}
          <div style={styles.buddyGrid}>
            {buddies.map((b, i) => {
              const initials = b.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={b.id} className="card card-hover" style={styles.buddyCard}>
                  {/* Card top colour band */}
                  <div style={{ ...styles.cardTop, background: avatarColors[i % avatarColors.length] }}>
                    <div style={styles.avatar}>{initials}</div>
                    <span style={{ ...styles.statusDot, background: b.available ? '#22c55e' : '#f59e0b' }} />
                  </div>

                  {/* Card body */}
                  <div style={styles.cardBody}>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', marginBottom: 2 }}>
                      {b.name}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.4 }}>
                      {[b.origin, b.university].filter(Boolean).join(' · ')}
                    </p>

                    {/* Language badges */}
                    {(b.languages || []).length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                        {(b.languages || []).map(l => (
                          <span key={l} className="badge badge-green">{l}</span>
                        ))}
                      </div>
                    )}

                    {/* Bio */}
                    {b.bio && (
                      <p style={{
                        fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
                        marginBottom: 14, flex: 1,
                        display: '-webkit-box', WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {b.bio}
                      </p>
                    )}

                    {/* CTA — always at bottom */}
                    <div style={{ marginTop: 'auto' }}>
                      {b.available ? (
                        <button className="btn-primary"
                          style={{ width: '100%', padding: '11px', fontSize: 13, minHeight: 44 }}
                          onClick={() => request(b.id, b.name)}
                          disabled={requesting[b.id]}>
                          {requesting[b.id] ? 'Sending...' : 'Request this buddy →'}
                        </button>
                      ) : (
                        <div style={styles.busyBtn}>Currently Busy</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <ConfirmModal {...modal} />
    </div>
  );
}

const styles = {
  heroBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    height: 160,
    marginBottom: '1.25rem',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg, rgba(255,92,58,0.85) 0%, rgba(10,92,68,0.7) 100%)',
  },
  heroContent: {
    position: 'relative', zIndex: 1,
    padding: '1.25rem 1.5rem',
    height: '100%',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
  },
  statusBanner: {
    borderRadius: 16, border: '1.5px solid',
    padding: '1rem',
    marginBottom: '1.25rem',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  blockedNote: {
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '2rem 1.5rem',
    textAlign: 'center',
  },
  searchWrap: {
    display: 'flex',
    gap: 8,
    marginBottom: '1.25rem',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
  },
  searchBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fff',
    border: '2px solid var(--border)',
    borderRadius: 50,
    padding: '10px 14px',
    boxShadow: 'var(--shadow-sm)',
    minWidth: 0,
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  buddyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
    gap: '1rem',
    alignItems: 'start',
  },
  buddyCard: {
    padding: 0,
    overflow: 'hidden',
    border: '1px solid var(--border)',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardTop: {
    height: 84,
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '0 1.25rem 0',
    flexShrink: 0,
  },
  avatar: {
    width: 54, height: 54,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.25)',
    backdropFilter: 'blur(8px)',
    border: '3px solid rgba(255,255,255,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 800, fontSize: 18,
    transform: 'translateY(27px)',
    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
    flexShrink: 0,
  },
  statusDot: {
    width: 13, height: 13,
    borderRadius: '50%',
    border: '2px solid #fff',
    position: 'absolute',
    bottom: -6, left: 62,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
  cardBody: {
    padding: '1.75rem 1.25rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  busyBtn: {
    width: '100%', padding: '11px',
    background: 'var(--cream-dark)',
    borderRadius: 50, textAlign: 'center',
    fontSize: 13, fontWeight: 600,
    color: 'var(--text-muted)',
    boxSizing: 'border-box',
    marginTop: 'auto',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1.5rem',
    background: '#fff',
    borderRadius: 20,
    border: '1px solid var(--border)',
  },
  unmatchBtn: {
    background: 'var(--coral-light)',
    border: '1.5px solid var(--coral)',
    borderRadius: 50,
    padding: '10px 18px',
    fontSize: 13, fontWeight: 700,
    color: 'var(--coral-dark)',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    minHeight: 44,
    boxSizing: 'border-box',
  },
};