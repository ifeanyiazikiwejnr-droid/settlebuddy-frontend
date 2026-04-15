import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

export default function UsersPage() {
  const { showToast } = useOutletContext();
  const [data, setData] = useState({ students: [], buddies: [], admins: [] });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await axios.get('/api/users');
      setData(res.data);
    } catch (err) {
      showToast('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await axios.delete(`/api/users/${id}`);
      showToast(`${name} deleted`);
      load();
    } catch {
      showToast('Error deleting user');
    }
  };

  const sections = [
    { key: 'students', label: 'Students', icon: '🎓', color: '#0f6e56', bg: '#e1f5ee' },
    { key: 'buddies', label: 'Buddies', icon: '🤝', color: '#ba7517', bg: '#faeeda' },
    { key: 'admins', label: 'Admins', icon: '🛡️', color: '#185fa5', bg: '#e6f1fb' },
  ];

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading users...</p>;

  const total = data.students.length + data.buddies.length + data.admins.length;

  return (
    <div>
      <div className="page-header">
        <h2>All Users</h2>
        <p>Everyone registered on Settle-In Buddy</p>
      </div>

      {/* Summary Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>👥</div>
          <div style={{ fontSize: '1.8rem', fontFamily: "'DM Serif Display',serif", color: 'var(--teal)' }}>{total}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Users</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>🎓</div>
          <div style={{ fontSize: '1.8rem', fontFamily: "'DM Serif Display',serif", color: 'var(--teal)' }}>{data.students.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Students</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>🤝</div>
          <div style={{ fontSize: '1.8rem', fontFamily: "'DM Serif Display',serif", color: 'var(--teal)' }}>{data.buddies.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Buddies</div>
        </div>
      </div>

      {/* User Sections */}
      {sections.map(section => (
        <div key={section.key} style={{ marginBottom: '2rem' }}>
          <div className="section-title">
            {section.icon} {section.label}
            <span style={{ background: section.bg, color: section.color, fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, fontFamily: 'Outfit, sans-serif' }}>
              {data[section.key].length}
            </span>
          </div>

          {data[section.key].length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '1rem 0' }}>
              No {section.label.toLowerCase()} registered yet.
            </p>
          ) : (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {data[section.key].map((user, index) => (
                <div key={user.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderTop: index === 0 ? 'none' : '1px solid var(--border)',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: section.bg, color: section.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 600, fontSize: 14, flexShrink: 0
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
                    {user.role === 'buddy' && user.university && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {user.origin} · {user.university}
                        {user.languages && (
                          <span> · {Array.isArray(user.languages) ? user.languages.join(', ') : user.languages}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  {user.role === 'buddy' && (
                    <span className={`badge ${user.available ? 'badge-teal' : 'badge-amber'}`}>
                      {user.available ? 'Available' : 'Busy'}
                    </span>
                  )}

                  {/* Joined date */}
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right', flexShrink: 0 }}>
                    Joined<br />
                    {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteUser(user.id, user.name)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--coral)', flexShrink: 0, padding: '4px 8px' }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}