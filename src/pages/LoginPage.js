import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const roles = ['student', 'buddy', 'admin'];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const canRegister = role !== 'buddy';

  const submit = async () => {
    setError(''); setLoading(true);
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role };
      const res = await axios.post(url, body);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.screen}>
      {/* Left panel - hero image */}
      <div style={styles.hero}>
        <img
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80"
          alt="London"
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
        />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🇬🇧 Made for international students</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.8rem', color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
            Your journey<br />to the UK<br /><em>starts here</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, maxWidth: 320 }}>
            Find accommodation, navigate transport, discover jobs, and connect with a buddy who truly understands your journey.
          </p>
          <div style={styles.heroStats}>
            {[['500+','Students helped'],['120+','Active buddies'],['50+','Languages']].map(([n,l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', color: '#fff', fontWeight: 700 }}>{n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={styles.formPanel}>
        <div style={styles.formInner}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={styles.logoMark}>S</div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--green)' }}>Settle-In Buddy</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', marginBottom: 6 }}>
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              {mode === 'login' ? 'Sign in to your account to continue' : 'Join thousands of students settling into UK life'}
            </p>
          </div>

          {/* Role selector */}
          <div style={styles.roleTabs}>
            {roles.map(r => (
              <button key={r} onClick={() => { setRole(r); setError(''); if (r === 'buddy') setMode('login'); }}
                style={{ ...styles.roleTab, ...(role === r ? styles.roleTabActive : {}) }}>
                {r === 'student' ? '🎓' : r === 'buddy' ? '🤝' : '🛡️'} {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {role === 'buddy' && (
            <div style={styles.infoBanner}>
              🔐 Buddy accounts are invite-only. Use your invite link to register, or sign in below if you already have an account.
            </div>
          )}

          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" placeholder="Your full name" value={form.name} onChange={handle} />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>

          {error && (
            <div style={styles.errorBox}>{error}</div>
          )}

          <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15, marginBottom: 16 }}
            onClick={submit} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>

          {canRegister && (
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <span style={{ color: 'var(--green)', cursor: 'pointer', fontWeight: 700 }}
                onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}>
                {mode === 'login' ? 'Register here' : 'Sign in'}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  screen: { minHeight: '100vh', display: 'flex', background: 'var(--cream)', justifyContent: 'center', alignItems: 'center' },
  hero: { flex: 1, position: 'relative', display: 'none', minHeight: '100vh', overflow: 'hidden' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(6,61,46,0.85) 0%, rgba(10,92,68,0.7) 50%, rgba(255,92,58,0.3) 100%)' },
  heroContent: { position: 'relative', zIndex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', padding: '8px 16px', borderRadius: 50, fontSize: 12, fontWeight: 700, marginBottom: 24, border: '1px solid rgba(255,255,255,0.2)' },
  heroStats: { display: 'flex', gap: 32, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.2)' },
  formPanel: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', overflowY: 'auto', minHeight: '100vh' },
  formInner: { width: '100%', maxWidth: 400 },
  logoMark: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--green),var(--green-mid))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 18 },
  roleTabs: { display: 'flex', background: 'var(--cream-dark)', borderRadius: 14, padding: 5, marginBottom: '1.5rem', gap: 4 },
  roleTab: { flex: 1, padding: '9px 6px', border: 'none', background: 'transparent', borderRadius: 10, fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s' },
  roleTabActive: { background: '#fff', color: 'var(--green)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  infoBanner: { background: 'var(--green-light)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: 'var(--green)', lineHeight: 1.6, fontWeight: 500 },
  errorBox: { background: '#fff1f0', border: '1px solid #ffc9c9', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#c92a2a', marginBottom: 14 },
};