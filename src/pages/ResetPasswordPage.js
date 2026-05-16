import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setError('');
    if (!form.password || !form.confirmPassword) return setError('Please fill in all fields');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { token, password: form.password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>S</div>
          <span style={styles.logoText}>Settle-In Buddy</span>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
            <h2 style={styles.title}>Password Reset!</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
              Your password has been updated successfully. You can now sign in with your new password.
            </p>
            <button className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 15 }}
              onClick={() => navigate('/login')}>
              Go to Login →
            </button>
          </div>
        ) : (
          <>
            <h2 style={styles.title}>Reset Password</h2>
            <p style={styles.subtitle}>Enter your new password below.</p>

            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="password" value={form.password}
                onChange={handle} placeholder="Min 6 characters" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword}
                onChange={handle} placeholder="Repeat new password"
                onKeyDown={e => e.key === 'Enter' && submit()} />
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <button className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 15, marginBottom: 16 }}
              onClick={submit} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password →'}
            </button>

            <p style={styles.backLink} onClick={() => navigate('/login')}>
              ← Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  screen: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'linear-gradient(160deg,#0a5c44 0%,#0f7a5a 45%,#e6f5f0 100%)' },
  card: { background: '#fff', borderRadius: 24, padding: '2rem', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem', justifyContent: 'center' },
  logoMark: { width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,var(--green),var(--green-mid))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 18 },
  logoText: { fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--green)' },
  title: { fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 13, color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6, textAlign: 'center' },
  errorBox: { background: '#fff1f0', border: '1px solid #ffc9c9', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#c92a2a', marginBottom: 14 },
  backLink: { textAlign: 'center', fontSize: 13, color: 'var(--green)', cursor: 'pointer', fontWeight: 600 },
};