import { useAuth } from '../context/AuthContext';

export default function PendingApprovalPage() {
  const { logout, user } = useAuth();

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>S</div>
          <span style={styles.logoText}>Settle-In Buddy</span>
        </div>

        <div style={{ fontSize: '3.5rem', marginBottom: '1rem', textAlign: 'center' }}>⏳</div>

        <h2 style={styles.title}>Awaiting Approval</h2>

        <p style={styles.body}>
          Hi <strong>{user?.name?.split(' ')[0]}</strong>! Your buddy account has been created successfully and is currently being reviewed by our admin team.
        </p>

        <div style={styles.stepsCard}>
          <div style={styles.step}>
            <div style={{ ...styles.stepNum, background: 'var(--green)' }}>✓</div>
            <div>
              <div style={styles.stepTitle}>Account created</div>
              <div style={styles.stepDesc}>Your registration is complete</div>
            </div>
          </div>
          <div style={styles.stepLine} />
          <div style={styles.step}>
            <div style={{ ...styles.stepNum, background: 'var(--amber)' }}>2</div>
            <div>
              <div style={styles.stepTitle}>Admin review</div>
              <div style={styles.stepDesc}>Our team is verifying your profile</div>
            </div>
          </div>
          <div style={styles.stepLine} />
          <div style={styles.step}>
            <div style={{ ...styles.stepNum, background: 'var(--border-dark)' }}>3</div>
            <div>
              <div style={styles.stepTitle}>Go live</div>
              <div style={styles.stepDesc}>Students will be able to find you</div>
            </div>
          </div>
        </div>

        <div style={styles.infoBox}>
          <p style={{ fontSize: 13, color: 'var(--green)', lineHeight: 1.7 }}>
            💡 This process usually takes less than 24 hours. You will be able to access your full dashboard once approved. Feel free to sign out and come back later.
          </p>
        </div>

        <button className="btn-outline" style={{ width: '100%', padding: 12, marginTop: 8 }}
          onClick={logout}>
          Sign Out
        </button>
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
  title: { fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', marginBottom: 12, textAlign: 'center' },
  body: { fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem', textAlign: 'center' },
  stepsCard: { background: 'var(--cream)', borderRadius: 16, padding: '1.25rem', marginBottom: '1.25rem' },
  step: { display: 'flex', alignItems: 'center', gap: 12 },
  stepNum: { width: 32, height: 32, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 },
  stepLine: { width: 2, height: 20, background: 'var(--border)', margin: '4px 0 4px 15px' },
  stepTitle: { fontSize: 13, fontWeight: 600, color: 'var(--text)' },
  stepDesc: { fontSize: 12, color: 'var(--text-muted)' },
  infoBox: { background: 'var(--green-light)', border: '1px solid #9FE1CB', borderRadius: 12, padding: '1rem', marginBottom: '1rem' },
};