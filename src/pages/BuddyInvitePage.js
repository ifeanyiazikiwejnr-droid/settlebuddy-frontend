import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', password: '', confirmPassword: '', origin: '', university: '', languages: '', bio: '' };

export default function BuddyInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [valid, setValid] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await axios.get(`/api/invites/${token}`);
        setEmail(res.data.email);
        setValid(true);
      } catch {
        setValid(false);
      }
    };
    validate();
  }, [token]);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setError('');
    if (!form.name || !form.password || !form.origin || !form.university || !form.languages || !form.bio)
      return setError('Please fill in all fields');
    if (form.password !== form.confirmPassword)
      return setError('Passwords do not match');
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters');

    setSaving(true);
    try {
      const res = await axios.post('/api/auth/register-buddy', { token, ...form });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setSaving(false); }
  };

  // Loading state
  if (valid === null) return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Validating your invite link...</p>
      </div>
    </div>
  );

  // Invalid token
  if (!valid) return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>❌</div>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", marginBottom: 8 }}>Invalid Link</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
            This invite link is invalid or has already been used. Please contact your admin for a new one.
          </p>
          <button className="btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.8rem', color: 'var(--teal)', marginBottom: 4 }}>
            Settle-In Buddy
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Complete your buddy registration</p>
        </div>

        <div style={{ background: 'var(--teal-light)', borderRadius: 8, padding: '10px 14px', marginBottom: '1.25rem', fontSize: 13, color: 'var(--teal)' }}>
          🎉 You've been invited as a buddy! Registering as: <strong>{email}</strong>
        </div>

        <div className="form-group">
          <label>Full Name</label>
          <input name="name" value={form.name} onChange={handle} placeholder="Your full name" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle} placeholder="Repeat password" />
        </div>
        <div className="form-group">
          <label>Country of Origin</label>
          <input name="origin" value={form.origin} onChange={handle} placeholder="e.g. Nigeria" />
        </div>
        <div className="form-group">
          <label>University</label>
          <input name="university" value={form.university} onChange={handle} placeholder="e.g. University of Birmingham" />
        </div>
        <div className="form-group">
          <label>Languages Spoken (comma separated)</label>
          <input name="languages" value={form.languages} onChange={handle} placeholder="e.g. Yoruba, Igbo, English" />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea name="bio" rows={3} value={form.bio} onChange={handle}
            placeholder="Tell students about yourself and how you can help them settle in..." />
        </div>

        {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 10 }}>{error}</p>}

        <button className="btn-primary" style={{ width: '100%', padding: 12 }}
          onClick={submit} disabled={saving}>
          {saving ? 'Creating account...' : 'Complete Registration'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  screen: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'linear-gradient(160deg,#0f6e56 0%,#1d9e75 45%,#e1f5ee 100%)' },
  card: { background: '#fff', borderRadius: 18, padding: '1.75rem', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' },
};