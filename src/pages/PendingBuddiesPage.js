import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import useConfirm from '../hooks/useConfirm';

export default function PendingBuddiesPage() {
  const { showToast } = useOutletContext();
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState({});
  const { modal, confirm } = useConfirm();

  const load = async () => {
    try {
      const res = await axios.get('/api/users/pending-buddies');
      setBuddies(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const verify = async (id, name) => {
    const ok = await confirm({
      title: 'Approve Buddy',
      message: `Approve ${name}? They will immediately appear in student searches.`,
      confirmText: 'Approve',
      cancelText: 'Cancel',
      danger: false,
    });
    if (!ok) return;
    setActing(a => ({ ...a, [id]: true }));
    try {
      await axios.patch(`/api/users/${id}/verify`);
      showToast(`${name} approved!`);
      load();
    } catch { showToast('Error approving buddy'); }
    finally { setActing(a => ({ ...a, [id]: false })); }
  };

  const reject = async (id, name) => {
    const ok = await confirm({
      title: 'Reject Buddy',
      message: `Reject and remove ${name}'s account? This cannot be undone.`,
      confirmText: 'Reject',
      cancelText: 'Cancel',
      danger: true,
    });
    if (!ok) return;
    setActing(a => ({ ...a, [id]: true }));
    try {
      await axios.patch(`/api/users/${id}/reject`);
      showToast(`${name} rejected`);
      load();
    } catch { showToast('Error rejecting buddy'); }
    finally { setActing(a => ({ ...a, [id]: false })); }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Pending Buddies</h2>
        <p>Review and approve buddy registrations</p>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}

      {!loading && buddies.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>✅</div>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>All caught up!</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No pending buddy registrations right now.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {buddies.map(b => (
          <div key={b.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--green-mid))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                {b.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{b.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.email}</div>
              </div>
              <span className="badge badge-amber">Pending</span>
            </div>

            {/* Profile details */}
            {(b.origin || b.university || b.bio) && (
              <div style={{ background: 'var(--cream)', borderRadius: 12, padding: '0.75rem 1rem', fontSize: 13 }}>
                {b.origin && <div style={{ marginBottom: 4 }}>🌍 <strong>Origin:</strong> {b.origin}</div>}
                {b.university && <div style={{ marginBottom: 4 }}>🎓 <strong>University:</strong> {b.university}</div>}
                {b.languages && <div style={{ marginBottom: 4 }}>🗣️ <strong>Languages:</strong> {Array.isArray(b.languages) ? b.languages.join(', ') : b.languages}</div>}
                {b.bio && <div style={{ color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 6 }}>{b.bio}</div>}
              </div>
            )}

            <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
              Registered {new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" style={{ flex: 1, padding: '10px', fontSize: 13 }}
                onClick={() => verify(b.id, b.name)} disabled={acting[b.id]}>
                ✓ Approve
              </button>
              <button style={{ flex: 1, padding: '10px', border: '2px solid var(--coral)', borderRadius: 50, background: 'var(--coral-light)', color: 'var(--coral-dark)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                onClick={() => reject(b.id, b.name)} disabled={acting[b.id]}>
                ✕ Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal {...modal} />
    </div>
  );
}