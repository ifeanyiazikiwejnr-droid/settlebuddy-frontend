import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

export default function BuddyRequestsPage() {
  const { showToast } = useOutletContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  const load = async () => {
    try {
      const res = await axios.get('/api/buddies/my-requests');
      setRequests(res.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const respond = async (id, status) => {
    setUpdating(u => ({ ...u, [id]: true }));
    try {
      await axios.patch(`/api/buddies/requests/${id}`, { status });
      showToast(`Request ${status}`);
      load();
    } catch { showToast('Error updating request'); }
    finally { setUpdating(u => ({ ...u, [id]: false })); }
  };

  const statusColor = { pending: 'badge-amber', accepted: 'badge-teal', declined: 'badge-coral' };

  return (
    <div>
      <div className="page-header">
        <h2>Student Requests</h2>
        <p>Students who want you as their buddy</p>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}

      {!loading && requests.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📬</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No requests yet. Make sure your profile is set up and you're marked as available.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {requests.map(r => (
          <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 15, flexShrink: 0 }}>
              {r.student_name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{r.student_name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.student_email}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>
                {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <span className={`badge ${statusColor[r.status] || 'badge-amber'}`} style={{ textTransform: 'capitalize' }}>
              {r.status}
            </span>
            {r.status === 'pending' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}
                  onClick={() => respond(r.id, 'accepted')} disabled={updating[r.id]}>
                  Accept
                </button>
                <button className="btn-outline" style={{ padding: '6px 14px', fontSize: 12, color: 'var(--coral)', borderColor: 'var(--coral)' }}
                  onClick={() => respond(r.id, 'declined')} disabled={updating[r.id]}>
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
