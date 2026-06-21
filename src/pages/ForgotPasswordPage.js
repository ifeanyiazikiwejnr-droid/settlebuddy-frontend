import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // email | code | reset | done
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const requestCode = async () => {
    if (!email) return setError('Please enter your email address');
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      if (!res.data.code) {
        setError('No account found with that email address. Please check and try again.');
        setLoading(false);
        return;
      }
      setGeneratedCode(res.data.code);
      setStep('code');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const verifyCode = () => {
    if (!code) return setError('Please enter the reset code');
    if (code !== generatedCode) return setError('Incorrect code. Please check and try again.');
    setError('');
    setStep('reset');
  };

  const resetPassword = async () => {
    if (!password || !confirm) return setError('Please fill in all fields');
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true); setError('');
    try {
      await axios.post('/api/auth/reset-password', { token: generatedCode, password });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>S</div>
          <span style={styles.logoText}>Settle-In Buddy</span>
        </div>

        {/* STEP 1 — Enter email */}
        {step === 'email' && (
          <>
            <h2 style={styles.title}>Forgot Password</h2>
            <p style={styles.subtitle}>Enter your email address to receive a reset code.</p>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                onKeyDown={e => e.key === 'Enter' && requestCode()} />
            </div>
            {error && <div style={styles.errorBox}>{error}</div>}
            <button className="btn-primary" style={styles.fullBtn}
              onClick={requestCode} disabled={loading}>
              {loading ? 'Generating code...' : 'Get Reset Code →'}
            </button>
            <span style={styles.backLink} onClick={() => navigate('/login')}>← Back to Login</span>
          </>
        )}

        {/* STEP 2 — Show code + verify */}
        {step === 'code' && (
          <>
            <h2 style={styles.title}>Your Reset Code</h2>
            <p style={styles.subtitle}>
              Share this code with <strong>{email}</strong> so they can reset their password.
            </p>

            {/* Big code display */}
            <div style={styles.codeBox}>
              <div style={styles.codeDigits}>{generatedCode}</div>
              <button style={styles.copyBtn} onClick={copyCode}>
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>

            <div style={styles.dividerRow}>
              <div style={styles.dividerLine}/>
              <span style={styles.dividerText}>Enter the code to continue</span>
              <div style={styles.dividerLine}/>
            </div>

            <div className="form-group">
              <label>Enter Reset Code</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit code"
                maxLength={6}
                style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, letterSpacing: 8 }}
                onKeyDown={e => e.key === 'Enter' && verifyCode()}
              />
            </div>
            {error && <div style={styles.errorBox}>{error}</div>}
            <button className="btn-primary" style={styles.fullBtn} onClick={verifyCode}>
              Verify Code →
            </button>
            <span style={styles.backLink} onClick={() => setStep('email')}>← Back</span>
          </>
        )}

        {/* STEP 3 — Set new password */}
        {step === 'reset' && (
          <>
            <h2 style={styles.title}>New Password</h2>
            <p style={styles.subtitle}>Choose a strong new password.</p>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                onKeyDown={e => e.key === 'Enter' && resetPassword()} />
            </div>
            {error && <div style={styles.errorBox}>{error}</div>}
            <button className="btn-primary" style={styles.fullBtn}
              onClick={resetPassword} disabled={loading}>
              {loading ? 'Saving...' : 'Reset Password →'}
            </button>
            <span style={styles.backLink} onClick={() => setStep('code')}>← Back</span>
          </>
        )}

        {/* STEP 4 — Done */}
        {step === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
            <h2 style={styles.title}>Password Reset!</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
              Your password has been updated successfully. You can now sign in.
            </p>
            <button className="btn-primary" style={styles.fullBtn}
              onClick={() => navigate('/login')}>
              Go to Login →
            </button>
          </div>
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
  fullBtn: { width: '100%', padding: '13px', fontSize: 15, marginBottom: 14 },
  backLink: { display: 'block', textAlign: 'center', fontSize: 13, color: 'var(--green)', cursor: 'pointer', fontWeight: 600 },
  codeBox: { background: 'var(--green-light)', border: '2px solid #9FE1CB', borderRadius: 16, padding: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  codeDigits: { fontFamily: "'Playfair Display',serif", fontSize: '2.2rem', fontWeight: 900, color: 'var(--green)', letterSpacing: 6 },
  copyBtn: { background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 50, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", flexShrink: 0 },
  dividerRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' },
  dividerLine: { flex: 1, height: 1, background: 'var(--border)' },
  dividerText: { fontSize: 11, color: 'var(--text-faint)', fontWeight: 600, whiteSpace: 'nowrap' },
};