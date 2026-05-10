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
        <div className="card" style={{ maxWidth: 520, marginBottom: '2rem', background: 'var(--green-light)', borderColor: '#9FE1CB' }}>
          <div style={{ fontWeight: 700, color: 'var(--green)', marginBottom: 10, fontSize: 14 }}>
            ✅ Invite link generated — share this with the buddy:
          </div>

          {/* Clickable link */}
          <a href={inviteLink} target="_blank" rel="noreferrer"
            style={{ display: 'block', background: '#fff', border: '1.5px solid #9FE1CB', borderRadius: 10, padding: '10px 14px', fontSize: 12, wordBreak: 'break-all', color: 'var(--green)', marginBottom: 12, textDecoration: 'underline', lineHeight: 1.6 }}>
            {inviteLink}
          </a>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn-secondary" style={{ fontSize: 13 }} onClick={copyLink}>
              📋 Copy Link
            </button>
            <a href={`mailto:?subject=Settle-In Buddy Invite&body=You have been invited to join Settle-In Buddy as a buddy! Click the link below to complete your registration:%0A%0A${inviteLink}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: '2px solid var(--border-dark)', borderRadius: 50, padding: '9px 18px', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', cursor: 'pointer' }}>
              ✉️ Send via Email
            </a>
            <a href={`https://wa.me/?text=You've been invited to join Settle-In Buddy as a buddy! Complete your registration here: ${encodeURIComponent(inviteLink)}`}
              target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#25D366', border: 'none', borderRadius: 50, padding: '9px 18px', fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
              💬 Send via WhatsApp
            </a>
          </div>

          <p style={{ fontSize: 12, color: 'var(--green)', marginTop: 10, opacity: 0.8 }}>
            ⏳ This link is single-use and expires once the buddy registers.
          </p>
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