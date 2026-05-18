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
  { path: '/chat', label: 'Messages', icon: '💬' },
  { path: '/how-it-works', label: 'How it Works', icon: '❓' },
];
const buddyNav = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/my-profile', label: 'My Profile', icon: '👤' },
  { path: '/my-requests', label: 'Requests', icon: '📬' },
  { path: '/chat', label: 'Messages', icon: '💬' },
];
const adminNav = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/accommodations', label: 'Accommodations', icon: '🏡' },
  { path: '/users', label: 'All Users', icon: '👥' },
  { path: '/pending-buddies', label: 'Pending Buddies', icon: '⏳' },
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
    <div style={styles.shell}>

      {/* Topbar */}
      <div style={styles.topbar}>
        <div style={styles.topLeft}>
          <button onClick={() => setSidebarOpen(o => !o)} style={styles.hamburger} aria-label="Open menu">
            <span style={styles.bar} />
            <span style={styles.bar} />
            <span style={styles.bar} />
          </button>
          <div style={styles.brandRow}>
            <div style={styles.logoMark}>S</div>
            <span style={styles.brandName}>Settle-In Buddy</span>
          </div>
        </div>
        <div style={styles.topRight}>
          <div style={styles.userPill}>
            <div style={styles.userAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <span style={styles.userName}>{user?.name?.split(' ')[0]}</span>
          </div>
          <button className="btn-ghost" onClick={logout} style={{ fontSize: 12, padding: '6px 10px', minHeight: 36 }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div style={styles.sidebarHeader}>
          <div style={styles.brandRow}>
            <div style={styles.logoMark}>S</div>
            <span style={styles.brandName}>Settle-In Buddy</span>
          </div>
          <button onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-muted)', padding: 4, lineHeight: 1 }}
            aria-label="Close menu">✕</button>
        </div>

        {/* User info */}
        <div style={styles.sidebarUser}>
          <div style={{ ...styles.userAvatar, width: 40, height: 40, fontSize: 16 }}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role} account</div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ padding: '0.5rem 0.75rem', flex: 1, overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <div key={item.path} onClick={() => handleNav(item.path)}
                style={{
                  ...styles.navItem,
                  background: active ? 'var(--green)' : 'transparent',
                  color: active ? '#fff' : 'var(--text-muted)',
                  fontWeight: active ? 700 : 500,
                  boxShadow: active ? '0 4px 14px rgba(10,92,68,0.25)' : 'none',
                }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
          <button className="btn-outline" style={{ width: '100%', fontSize: 13 }} onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <Outlet context={{ showToast }} />
        <Footer />
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

const styles = {
  shell: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--cream)' },
  topbar: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    padding: '0 1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: 56, position: 'sticky', top: 0, zIndex: 300,
    flexShrink: 0,
  },
  topLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  topRight: { display: 'flex', alignItems: 'center', gap: 6 },
  hamburger: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: '6px 4px', borderRadius: 8, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  bar: { display: 'block', width: 20, height: 2, background: 'var(--text)', borderRadius: 2 },
  brandRow: { display: 'flex', alignItems: 'center', gap: 8 },
  brandName: { fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, color: 'var(--green)', whiteSpace: 'nowrap' },
  logoMark: { width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,var(--green),var(--green-mid))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 15, flexShrink: 0 },
  userPill: { display: 'flex', alignItems: 'center', gap: 6, background: 'var(--cream)', padding: '4px 10px 4px 4px', borderRadius: 50, border: '1px solid var(--border)' },
  userAvatar: { width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--coral))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 },
  userName: { fontSize: 12, fontWeight: 600, color: 'var(--text)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  sidebar: {
    position: 'fixed', top: 56, left: 0, bottom: 0, width: 'min(280px, 85vw)',
    background: '#fff', borderRight: '1px solid var(--border)',
    zIndex: 250, display: 'flex', flexDirection: 'column',
    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
    overflowY: 'auto', boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
  },
  sidebarHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border)' },
  sidebarUser: { display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem 1rem', background: 'var(--cream)', margin: '0.75rem', borderRadius: 12 },
  navItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer', fontSize: 14, borderRadius: 12, marginBottom: 4, transition: 'all .18s', minHeight: 48 },
  sidebarFooter: { padding: '1rem', borderTop: '1px solid var(--border)', marginTop: 'auto' },
  main: { flex: 1, padding: '1.25rem 1rem', overflowY: 'auto', width: '100%', maxWidth: '100%' },
};
