import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

export default function RegisterBuddyPage() {
  const { showToast } = useOutletContext();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [inviteLink, setInviteLink] = useState(null);
  const [invites, setInvites] = useState([]);

  const loadInvites = async () => {
    try {
      const res = await axios.get('/api/invites');
      setInvites(res.data);
    } catch {}
  };

  useEffect(() => { loadInvites(); }, []);

  const sendInvite = async () => {
    if (!email) return showToast('Please enter an email address');
    setSending(true);
    setInviteLink(null);
    try {
      const res = await axios.post('/api/invites', { email });
      setInviteLink(res.data.link);
      setEmail('');
      showToast('Invite created successfully!');
      loadInvites();
    } catch (err) {
      showToast(err.response?.data?.error || 'Error creating invite');
    } finally { setSending(false); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    showToast('Link copied to clipboard!');
  };

  return (
    <div>
      <div className="page-header">
        <h2>Register a Buddy</h2>
        <p>Send an invite link to a new buddy — they complete their own registration</p>
      </div>

      {/* Invite form */}
      <div className="card" style={{ maxWidth: 520, marginBottom: '2rem' }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Send Invite Link</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="buddy@email.com"
            onKeyDown={e => e.key === 'Enter' && sendInvite()}
            style={{ flex: 1, padding: '10px 13px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none' }}
          />
          <button className="btn-primary" onClick={sendInvite} disabled={sending}>
            {sending ? 'Sending...' : 'Send Invite'}
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          The buddy will receive a unique link to complete their registration with their own name, password and profile details.
        </p>
      </div>

      {/* Generated link */}
      {inviteLink && (
        <div className="card" style={{ maxWidth: 520, marginBottom: '2rem', background: 'var(--teal-light)', borderColor: '#9FE1CB' }}>
          <div style={{ fontWeight: 500, color: 'var(--teal)', marginBottom: 8, fontSize: 14 }}>
            ✅ Invite link generated — share this with the buddy:
          </div>
          <div style={{ background: '#fff', border: '1px solid #9FE1CB', borderRadius: 8, padding: '10px 12px', fontSize: 12, wordBreak: 'break-all', color: 'var(--text-muted)', marginBottom: 10 }}>
            {inviteLink}
          </div>
          <button className="btn-primary" style={{ fontSize: 13 }} onClick={copyLink}>
            Copy Link
          </button>
        </div>
      )}

      {/* Invite history */}
      <div className="section-title">
        📋 Invite History
        <span style={{ background: 'var(--teal-light)', color: 'var(--teal)', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20 }}>
          {invites.length}
        </span>
      </div>

      {invites.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No invites sent yet.</p>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', maxWidth: 520 }}>
          {invites.map((inv, index) => (
            <div key={inv.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              borderTop: index === 0 ? 'none' : '1px solid var(--border)',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{inv.email}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Invited by {inv.invited_by} · {new Date(inv.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <span className={`badge ${inv.used ? 'badge-teal' : 'badge-amber'}`}>
                {inv.used ? 'Registered' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}