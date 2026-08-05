import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import useConfirm from '../hooks/useConfirm';

export default function PremiumUsersPage() {
  const { showToast } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState({});
  const [tab, setTab] = useState('premium');
  const { modal, confirm } = useConfirm();

  const load = async () => {
    try {
      const [premRes, allRes] = await Promise.all([
        axios.get('/api/users/premium'),
        axios.get('/api/users'),
      ]);
      setUsers(premRes.data);
      setAllStudents(allRes.data.students || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const togglePremium = async (id, name, currentlyPremium) => {
    const ok = await confirm({
      title: currentlyPremium ? 'Remove Premium' : 'Upgrade to Premium',
      message: currentlyPremium
        ? `Remove premium access from ${name}? They will lose buddy matching and chat features.`
        : `Upgrade ${name} to Premium? They will gain access to buddy matching, chat and accommodations.`,
      confirmText: currentlyPremium ? 'Remove Premium' : 'Upgrade',
      cancelText: 'Cancel',
      danger: currentlyPremium,
    });
    if (!ok) return;
    setActing(a => ({ ...a, [id]: true }));
    try {
      await axios.patch(`/api/users/${id}/premium`, { is_premium: !currentlyPremium });
      showToast(currentlyPremium ? `Premium removed from ${name}` : `${name} upgraded to Premium!`);
      load();
    } catch { showToast('Error updating premium status'); }
    finally { setActing(a => ({ ...a, [id]: false })); }
  };

  const nonPremiumStudents = allStudents.filter(s => !s.is_premium);

  return (
    <div>
      <div className="page-header">
        <h2>Premium Users</h2>
        <p>Manage student premium subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontFamily: "'Playfair Display',serif", color: '#f07020', marginBottom: 4 }}>{users.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Premium Users</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontFamily: "'Playfair Display',serif", color: 'var(--green)', marginBottom: 4 }}>{nonPremiumStudents.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Free Users</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontFamily: "'Playfair Display',serif", color: 'var(--green)', marginBottom: 4 }}>
            £{(users.length * 4.99).toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Revenue</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(tab === 'premium' ? styles.tabActive : {}) }}
          onClick={() => setTab('premium')}>
          ⭐ Premium ({users.length})
        </button>
        <button style={{ ...styles.tab, ...(tab === 'free' ? styles.tabActive : {}) }}
          onClick={() => setTab('free')}>
          Free ({nonPremiumStudents.length})
        </button>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}

      {/* Premium users list */}
      {!loading && tab === 'premium' && (
        <>
          {users.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>⭐</div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>No premium users yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Switch to the Free tab to upgrade students.</p>
            </div>
          ) : (
            <div style={styles.list}>
              {users.map((u, i) => (
                <div key={u.id} style={{ ...styles.row, borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                  <div style={styles.avatar}>{u.name.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {u.name}
                      <span style={styles.premiumBadge}>⭐ Premium</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    {u.premium_since && (
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
                        Since {new Date(u.premium_since).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                  <button
                    style={styles.removeBtn}
                    onClick={() => togglePremium(u.id, u.name, true)}
                    disabled={acting[u.id]}>
                    Remove Premium
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Free users list */}
      {!loading && tab === 'free' && (
        <>
          {nonPremiumStudents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>All students are on premium!</p>
            </div>
          ) : (
            <div style={styles.list}>
              {nonPremiumStudents.map((u, i) => (
                <div key={u.id} style={{ ...styles.row, borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                  <div style={{ ...styles.avatar, background: 'var(--green-light)', color: 'var(--green)' }}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
                      Joined {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: 12, flexShrink: 0 }}
                    onClick={() => togglePremium(u.id, u.name, false)}
                    disabled={acting[u.id]}>
                    ⭐ Upgrade
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal {...modal} />
    </div>
  );
}

const styles = {
  tabs: { display: 'flex', background: 'var(--cream-dark)', borderRadius: 14, padding: 5, marginBottom: '1.5rem', gap: 4 },
  tab: { flex: 1, padding: '10px', border: 'none', background: 'transparent', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s', minHeight: 44 },
  tabActive: { background: '#fff', color: 'var(--green)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  list: { background: '#fff', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' },
  row: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', flexWrap: 'wrap' },
  avatar: { width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#f5a623,#f07020)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 },
  premiumBadge: { background: 'linear-gradient(135deg,#f5a623,#f07020)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50 },
  removeBtn: { background: 'var(--coral-light)', border: 'none', borderRadius: 50, padding: '7px 14px', fontSize: 12, fontWeight: 700, color: 'var(--coral-dark)', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", flexShrink: 0 },
};