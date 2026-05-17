import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import useConfirm from '../hooks/useConfirm';

const roleConfig = {
  students: { label: 'Students', icon: '🎓', color: 'var(--green)', bg: 'var(--green-light)' },
  buddies: { label: 'Buddies', icon: '🤝', color: 'var(--coral-dark)', bg: 'var(--coral-light)' },
  admins: { label: 'Admins', icon: '🛡️', color: '#185fa5', bg: '#e6f1fb' },
};

export default function UserListPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { showToast } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});

  const config = roleConfig[role] || roleConfig.students;
  const { modal, confirm } = useConfirm();

  const load = async () => {
    try {
      const res = await axios.get('/api/users');
      const list = res.data[role] || [];
      setUsers(list);
      setFiltered(list);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [role]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(users); return; }
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      u.email.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q)
    ));
  }, [search, users]);

  const deleteUser = async (id, name) => {
    const ok = await confirm({
      title: 'Remove User',
      message: `Are you sure you want to remove ${name}? Their account and all associated data will be permanently deleted.`,
      confirmText: 'Remove User',
      cancelText: 'Cancel',
      danger: true,
    });
    if (!ok) return;
    setDeleting(d => ({ ...d, [id]: true }));
    try {
      await axios.delete(`/api/users/${id}`);
      showToast(`${name} removed`);
      load();
    } catch { showToast('Error removing user'); }
    finally { setDeleting(d => ({ ...d, [id]: false })); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/users')} style={styles.backBtn}>← Back</button>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', lineHeight: 1.2 }}>
            {config.icon} {config.label}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {loading ? 'Loading...' : `${filtered.length} of ${users.length} ${config.label.toLowerCase()}`}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div style={styles.searchWrap}>
        <div style={styles.searchBox}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search by name or email...`}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent', fontFamily: "'Plus Jakarta Sans',sans-serif", minWidth: 0 }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, flexShrink: 0 }}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading users...</p>}

      {!loading && filtered.length === 0 && (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>👤</div>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>
            {search ? `No results for "${search}"` : `No ${config.label.toLowerCase()} yet`}
          </p>
          {search && (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Try searching by a different email or name</p>
          )}
        </div>
      )}

      {filtered.length > 0 && (
        <div style={styles.userList}>
          {filtered.map((user, index) => (
            <div key={user.id} style={{ ...styles.userRow, borderTop: index === 0 ? 'none' : '1px solid var(--border)' }}>
              {/* Avatar */}
              <div style={{ ...styles.avatar, background: config.bg, color: config.color }}>
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
                {role === 'buddies' && user.university && (
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
                    {user.origin} · {user.university}
                  </div>
                )}
              </div>

              {/* Status */}
              {role === 'buddies' && (
                <span className={`badge ${user.available ? 'badge-green' : 'badge-amber'}`} style={{ flexShrink: 0 }}>
                  {user.available ? 'Available' : 'Busy'}
                </span>
              )}

              {/* Joined date */}
              <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right', flexShrink: 0 }}>
                <div>Joined</div>
                <div>{new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>

              {/* Delete */}
              <button onClick={() => deleteUser(user.id, user.name)}
                style={styles.deleteBtn} disabled={deleting[user.id]}>
                {deleting[user.id] ? '...' : 'Remove'}
              </button>
            </div>
          ))}
        </div>
      )}
    <ConfirmModal {...modal} />
    </div>
  );
}

const styles = {
  backBtn: { background: 'var(--green-light)', border: 'none', borderRadius: 50, padding: '8px 18px', fontSize: 13, fontWeight: 700, color: 'var(--green)', cursor: 'pointer', flexShrink: 0, minHeight: 44 },
  searchWrap: { marginBottom: '1.5rem' },
  searchBox: { display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '2px solid var(--border)', borderRadius: 50, padding: '10px 18px', boxShadow: 'var(--shadow-sm)' },
  emptyState: { background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: '3rem', textAlign: 'center' },
  userList: { background: '#fff', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' },
  userRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', flexWrap: 'wrap' },
  avatar: { width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 },
  deleteBtn: { background: 'var(--coral-light)', border: 'none', borderRadius: 50, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: 'var(--coral-dark)', cursor: 'pointer', flexShrink: 0, minHeight: 36 },
};