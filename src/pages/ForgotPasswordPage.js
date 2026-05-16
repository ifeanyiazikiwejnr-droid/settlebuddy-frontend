import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email) return setError('Please enter your email address');
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(result.link);
  };

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>S</div>
          <span style={styles.logoText}>Settle-In Buddy</span>
        </div>

        {!result ? (
          <>
            <h2 style={styles.title}>Forgot Password</h2>
            <p style={styles.subtitle}>
              Enter your email address and we'll generate a password reset link for you.
            </p>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                onKeyDown={e => e.key === 'Enter' && submit()} />
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <button className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 15, marginBottom: 16 }}
              onClick={submit} disabled={loading}>
              {loading ? 'Generating link...' : 'Send Reset Link →'}
            </button>

            <p style={styles.backLink} onClick={() => navigate('/login')}>
              ← Back to Login
            </p>
          </>
        ) : (
          <>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.title}>Reset Link Ready</h2>
            <p style={styles.subtitle}>
              Share this link with the user so they can reset their password. In a future update this will be sent automatically via email.
            </p>

            <div style={styles.linkBox}>
              <a href={result.link} target="_blank" rel="noreferrer"
                style={{ fontSize: 12, color: 'var(--green)', wordBreak: 'break-all', lineHeight: 1.6, textDecoration: 'underline' }}>
                {result.link}
              </a>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: 13 }} onClick={copyLink}>
                📋 Copy Link
              </button>
              <a href={`https://wa.me/?text=Reset your Settle-In Buddy password here: ${encodeURIComponent(result.link)}`}
                target="_blank" rel="noreferrer"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#25D366', border: 'none', borderRadius: 50, padding: '10px', fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
                💬 WhatsApp
              </a>
            </div>

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
  successIcon: { fontSize: '2.5rem', textAlign: 'center', marginBottom: 12 },
  linkBox: { background: 'var(--green-light)', border: '1.5px solid #9FE1CB', borderRadius: 12, padding: '12px 14px', marginBottom: 16 },
};