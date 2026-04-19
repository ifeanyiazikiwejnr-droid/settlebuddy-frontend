import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>

        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.logoMark}>S</div>
          <div>
            <div style={styles.logoText}>Settle-In Buddy</div>
            <div style={styles.tagline}>Your UK student companion</div>
          </div>
        </div>

        {/* Links */}
        <div style={styles.linksGrid}>
          <div style={styles.linkGroup}>
            <div style={styles.groupTitle}>Students</div>
            <span style={styles.link} onClick={() => navigate('/accommodations')}>Accommodations</span>
            <span style={styles.link} onClick={() => navigate('/transport')}>Transportation</span>
            <span style={styles.link} onClick={() => navigate('/jobs')}>Jobs</span>
            <span style={styles.link} onClick={() => navigate('/buddy')}>Find a Buddy</span>
          </div>
          <div style={styles.linkGroup}>
            <div style={styles.groupTitle}>Platform</div>
            <span style={styles.link} onClick={() => navigate('/how-it-works')}>How it Works</span>
            <span style={styles.link} onClick={() => navigate('/login')}>Sign In</span>
            <span style={styles.link} onClick={() => navigate('/login?mode=register')}>Register</span>
            <span style={styles.link} onClick={() => navigate('/landing')}>Home</span>
          </div>
          <div style={styles.linkGroup}>
            <div style={styles.groupTitle}>Resources</div>
            <a style={styles.link} href="https://www.ukcisa.org.uk" target="_blank" rel="noreferrer">UKCISA</a>
            <a style={styles.link} href="https://www.gov.uk/student-visa" target="_blank" rel="noreferrer">Student Visa</a>
            <a style={styles.link} href="https://www.nhsbsa.nhs.uk" target="_blank" rel="noreferrer">NHS</a>
            <a style={styles.link} href="https://www.16-25railcard.co.uk" target="_blank" rel="noreferrer">Railcard</a>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomInner}>
          <span style={styles.copyright}>© {year} Settle-In Buddy. All rights reserved.</span>
          <div style={styles.bottomLinks}>
            <span style={styles.bottomLink}>Privacy Policy</span>
            <span style={styles.dot}>·</span>
            <span style={styles.bottomLink}>Terms of Use</span>
            <span style={styles.dot}>·</span>
            <span style={styles.bottomLink}>Contact Us</span>
          </div>
          <div style={styles.madeWith}>
            🇬🇧 Made for international students
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: 'linear-gradient(160deg, #063d2e 0%, #0a5c44 60%, #0f7a5a 100%)',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '3rem 1.5rem 2rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2.5rem',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    maxWidth: 220,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Playfair Display',serif",
    fontWeight: 900,
    fontSize: 22,
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Playfair Display',serif",
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 2,
  },
  tagline: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: 500,
  },
  linksGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
  },
  linkGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    minWidth: 120,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: 800,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: 4,
  },
  link: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    cursor: 'pointer',
    transition: 'color .2s',
    fontWeight: 500,
    textDecoration: 'none',
    display: 'block',
  },
  bottomBar: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '1rem 1.5rem',
  },
  bottomInner: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  copyright: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: 500,
  },
  bottomLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  bottomLink: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'color .2s',
  },
  dot: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 12,
  },
  madeWith: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: 500,
  },
};