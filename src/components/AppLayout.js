import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

const studentNav = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/accommodations', label: 'Accommodations', icon: '🏡' },
  { path: '/transport', label: 'Transport', icon: '🚌' },
  { path: '/buddy', label: 'Find a Buddy', icon: '🤝' },
  { path: '/jobs', label: 'Jobs', icon: '💼' },
  { path: '/how-it-works', label: 'How it Works', icon: '❓' },
];
const buddyNav = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/my-profile', label: 'My Profile', icon: '👤' },
  { path: '/my-requests', label: 'Requests', icon: '📬' },
];
const adminNav = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/accommodations', label: 'Accommodations', icon: '🏡' },
  { path: '/users', label: 'All Users', icon: '👥' },
  { path: '/register-buddy', label: 'Register Buddy', icon: '🤝' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === 'buddy' ? buddyNav
    : user?.role === 'admin' ? adminNav
    : studentNav;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const handleNav = (path) => { navigate(path); setSidebarOpen(false); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--cream)' }}>

      {/* Topbar */}
      <div style={styles.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={styles.hamburger}>
            <span style={styles.bar} />
            <span style={styles.bar} />
            <span style={styles.bar} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={styles.logo}>S</div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--green)' }}>
              Settle-In Buddy
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={styles.userPill}>
            <div style={styles.userAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user?.name?.split(' ')[0]}</span>
            <span className="badge badge-green" style={{ fontSize: 10 }}>{user?.role}</span>
          </div>
          <button className="btn-ghost" onClick={logout} style={{ fontSize: 12 }}>Sign out</button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* Sidebar */}
        <aside style={{ ...styles.sidebar, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
          <div style={styles.sidebarHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={styles.logo}>S</div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, color: 'var(--green)' }}>Settle-In</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
          </div>

          <div style={{ padding: '0.5rem 1rem 1rem' }}>
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <div key={item.path} onClick={() => handleNav(item.path)}
                  style={{
                    ...styles.navItem,
                    background: active ? 'var(--green)' : 'transparent',
                    color: active ? '#fff' : 'var(--text-muted)',
                    fontWeight: active ? 700 : 500,
                    boxShadow: active ? '0 4px 14px rgba(10,92,68,0.3)' : 'none',
                  }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  {item.label}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', background: 'var(--cream)', borderRadius: 12, marginBottom: 10 }}>
              <div style={{ ...styles.userAvatar, width: 36, height: 36, fontSize: 14 }}>{user?.name?.charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
              </div>
            </div>
            <button className="btn-outline" style={{ width: '100%', fontSize: 13 }} onClick={logout}>Sign out</button>
          </div>
        </aside>

        <main style={styles.main}>
          <Outlet context={{ showToast }} />
        </main>
      </div>

      {toast && <div className="toast">{toast}</div>}
      <Footer />
    </div>
  
  );
}

const styles = {
  topbar: {
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    padding: '0 1.25rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: 60, position: 'sticky', top: 0, zIndex: 300,
  },
  logo: {
    width: 32, height: 32, borderRadius: 10,
    background: 'linear-gradient(135deg, var(--green), var(--green-mid))',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 16,
  },
  hamburger: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 },
  bar: { display: 'block', width: 22, height: 2.5, background: 'var(--text)', borderRadius: 2 },
  userPill: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--cream)', padding: '6px 12px 6px 6px', borderRadius: 50, border: '1px solid var(--border)' },
  userAvatar: { width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--coral))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 },
  sidebar: {
    position: 'fixed', top: 60, left: 0, bottom: 0, width: 260,
    background: '#fff', borderRight: '1px solid var(--border)',
    zIndex: 250, display: 'flex', flexDirection: 'column',
    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
    overflowY: 'auto', boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
  },
  sidebarHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1rem 0.75rem', borderBottom: '1px solid var(--border)', marginBottom: 8 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', cursor: 'pointer', fontSize: 13.5, borderRadius: 12, marginBottom: 4, transition: 'all .18s' },
  main: { flex: 1, padding: '1.75rem 1.25rem', overflowY: 'auto', width: '100%' },
};